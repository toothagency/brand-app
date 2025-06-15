// ./components/results/ResultsDisplay.tsx
"use client";
import React, { useState, useRef, useMemo } from "react";
import type {
  DetailedBrandObject,
  BrandObjectColor,
  BrandObjectLogo,
  BrandObjectTypography,
  BrandObjectApplication,
  CalendarEntry,
} from "../../utils/types";
import {
  Download,
  MessageSquare,
  Target,
  Palette,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";
// html2canvas might still be useful for complex visual elements like generated logo mockups if you can't draw them with jsPDF
// import html2canvas from 'html2canvas';
import toast from "react-hot-toast";
import ImprovedPdfBuilder from "../form/EnhancedPdfBuilder";

interface ResultsDisplayProps {
  brandData: DetailedBrandObject;
  onStartOver: () => void;
}

// --- ResultSection and KeyValueDisplay remain mostly the same for screen display ---
// ... (ResultSection and KeyValueDisplay components as previously defined) ...
const ResultSection: React.FC<{
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  elementId?: string;
}> = /* ... as before ... */ ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  elementId,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const sectionId =
    elementId || `section-content-${title.replace(/\s+/g, "-")}`;

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 transition-all duration-300 ease-in-out hover:shadow-2xl print:shadow-none print:mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-xl print:cursor-default print:py-4"
        aria-expanded={isOpen}
        aria-controls={sectionId}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 print:text-gray-700" />
          )}
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 print:text-xl">
            {title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-gray-500 print:hidden" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-500 print:hidden" />
        )}
      </button>
      {isOpen && (
        <div
          id={sectionId}
          className="p-5 sm:p-6 border-t border-gray-200 print:border-t-0 print:px-2 print:py-3"
        >
          {children}
        </div>
      )}
    </div>
  );
};
const KeyValueDisplay: React.FC<{
  label: string;
  value: string | string[] | undefined | null;
  className?: string;
  isHtml?: boolean;
}> = /* ... as before ... */ ({
  label,
  value,
  className = "",
  isHtml = false,
}) => {
  const displayValue =
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ? (
      <p className="text-gray-500 italic text-sm print:text-xs">
        Not available
      </p>
    ) : Array.isArray(value) ? (
      <ul className="list-disc list-inside text-gray-700 space-y-1 pl-1 print:text-sm print:space-y-0.5">
        {value.map((item, i) => (
          <li key={i} className="text-gray-700 leading-relaxed print:text-sm">
            {item}
          </li>
        ))}
      </ul>
    ) : isHtml ? ( // For HTML content, html2canvas might be better if jsPDF text styling is too limited
      <div
        className="text-gray-700 leading-relaxed prose prose-sm max-w-none print:text-sm print:prose-xs"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    ) : (
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap print:text-sm">
        {value}
      </p>
    );

  return (
    <div className={`mb-4 print:mb-2 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1.5 print:text-xs print:mb-1">
        {label}
      </h4>
      {displayValue}
    </div>
  );
};

// --- PDF Generation Helper Class ---
class PdfBuilder {
  doc: jsPDF;
  currentY: number;
  pageHeight: number;
  pageWidth: number;
  leftMargin: number;
  rightMargin: number;
  contentWidth: number;
  lineHeightFactor: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      putOnlyUsedFonts: true,
    });
    this.doc.setFont("helvetica", "normal"); // Default font
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.leftMargin = 40;
    this.rightMargin = 40;
    this.currentY = 40; // Initial top margin
    this.contentWidth = this.pageWidth - this.leftMargin - this.rightMargin;
    this.lineHeightFactor = 1.4; // Adjust for line spacing
  }

  private addPageIfNeeded(neededHeight: number) {
    if (this.currentY + neededHeight > this.pageHeight - this.leftMargin) {
      // Check against bottom margin
      this.doc.addPage();
      this.currentY = this.leftMargin; // Reset Y to top margin
    }
  }

  addTitle(text: string, brandName?: string) {
    this.addPageIfNeeded(60);
    this.doc.setFontSize(28);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(40, 40, 40); // Dark gray
    this.doc.text(text, this.pageWidth / 2, this.currentY, { align: "center" });
    this.currentY += 20;
    if (brandName) {
      this.doc.setFontSize(16);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(0, 119, 190); // Blue
      this.doc.text(`For: ${brandName}`, this.pageWidth / 2, this.currentY, {
        align: "center",
      });
      this.currentY += 30;
    }
    this.doc.setDrawColor(200, 200, 200); // Light gray line
    this.doc.line(
      this.leftMargin,
      this.currentY,
      this.pageWidth - this.rightMargin,
      this.currentY
    );
    this.currentY += 20;
  }

  addSectionTitle(title: string) {
    this.addPageIfNeeded(30);
    this.doc.setFontSize(18);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(50, 50, 50);
    this.doc.text(title, this.leftMargin, this.currentY);
    this.currentY += this.doc.getLineHeight() * this.lineHeightFactor * 0.8;
    this.doc.setDrawColor(220, 220, 220);
    this.doc.line(
      this.leftMargin,
      this.currentY,
      this.contentWidth / 2 + this.leftMargin,
      this.currentY
    );
    this.currentY += this.doc.getLineHeight() * this.lineHeightFactor * 0.5;
  }

  addKeyValue(label: string, value: string | string[] | undefined | null) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      value = "Not available";
    }

    const labelHeight = 10; // Approximate height for label
    this.addPageIfNeeded(labelHeight);
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(100, 100, 100); // Medium gray
    this.doc.text(label.toUpperCase(), this.leftMargin, this.currentY);
    this.currentY += this.doc.getLineHeight() * this.lineHeightFactor * 0.7;

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(50, 50, 50); // Darker gray for value

    if (Array.isArray(value)) {
      value.forEach((item) => {
        const lines = this.doc.splitTextToSize(`• ${item}`, this.contentWidth);
        this.addPageIfNeeded(
          lines.length * this.doc.getLineHeight() * this.lineHeightFactor * 0.9
        );
        this.doc.text(lines, this.leftMargin + 10, this.currentY);
        this.currentY +=
          lines.length * this.doc.getLineHeight() * this.lineHeightFactor * 0.9;
      });
    } else {
      const lines = this.doc.splitTextToSize(value, this.contentWidth);
      this.addPageIfNeeded(
        lines.length * this.doc.getLineHeight() * this.lineHeightFactor
      );
      this.doc.text(lines, this.leftMargin, this.currentY);
      this.currentY +=
        lines.length * this.doc.getLineHeight() * this.lineHeightFactor;
    }
    this.currentY += 10; // Spacing after value
  }

  addParagraph(
    text: string | undefined | null,
    fontSize: number = 10,
    style: "normal" | "bold" | "italic" = "normal"
  ) {
    if (!text) return;
    this.addPageIfNeeded(20); // Guess height
    this.doc.setFontSize(fontSize);
    this.doc.setFont("helvetica", style);
    this.doc.setTextColor(50, 50, 50);
    const lines = this.doc.splitTextToSize(text, this.contentWidth);
    this.doc.text(lines, this.leftMargin, this.currentY);
    this.currentY +=
      lines.length *
      this.doc.getLineHeight() *
      this.lineHeightFactor *
      (fontSize / 10); // Adjust line height based on font size
    this.currentY += 5;
  }

  async addImage(
    imageUrl: string,
    description?: string,
    widthPt?: number,
    heightPt?: number
  ) {
    if (!imageUrl) return;
    this.addPageIfNeeded((heightPt || 150) + (description ? 30 : 0)); // Estimate height

    try {
      // Due to CORS, directly fetching images client-side to embed in PDF can be tricky.
      // If images are same-origin or CORS enabled, this might work.
      // Otherwise, you might need a backend proxy or to embed as base64 if possible.
      // For this example, we'll assume direct embedding works or you handle it.
      // const img = new Image();
      // img.crossOrigin = "Anonymous"; // Attempt to handle CORS
      // img.src = imageUrl;
      // await new Promise((resolve, reject) => {
      //     img.onload = resolve;
      //     img.onerror = () => { console.warn(`Could not load image for PDF: ${imageUrl}`); resolve(null); }; // Resolve even on error
      // });
      // if (img.complete && img.naturalWidth !== 0) {
      //     const aspectRatio = img.naturalWidth / img.naturalHeight;
      //     const maxWidth = widthPt || this.contentWidth / 2; // Example: half content width
      //     const w = Math.min(maxWidth, img.naturalWidth);
      //     const h = w / aspectRatio;
      //     this.doc.addImage(img, 'PNG', this.leftMargin, this.currentY, w, h);
      //     this.currentY += h + 5;
      // } else {
      //     this.addParagraph(`[Image not loaded: ${imageUrl}]`, 8, 'italic');
      // }
      this.addParagraph(
        `[Image Placeholder: ${imageUrl}] - Direct image embedding in jsPDF from URL is complex due to CORS. Consider backend proxy or base64.`,
        8,
        "italic"
      );

      if (description) {
        this.addParagraph(description, 8, "italic");
      }
      this.currentY += 10;
    } catch (e) {
      console.error("Error adding image to PDF:", e);
      this.addParagraph(`[Error loading image: ${imageUrl}]`, 8, "italic");
    }
  }

  addColorSwatch(color: BrandObjectColor) {
    this.addPageIfNeeded(50);
    this.doc.setFillColor(color.hex_value.substring(1)); // Remove # for jsPDF hex
    this.doc.rect(this.leftMargin, this.currentY, 30, 30, "F");
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(50, 50, 50);
    this.doc.text(
      `${color.color_name} (${color.hex_value})`,
      this.leftMargin + 40,
      this.currentY + 10
    );
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    const descLines = this.doc.splitTextToSize(
      color.description,
      this.contentWidth - 40
    );
    this.doc.text(descLines, this.leftMargin + 40, this.currentY + 22);
    this.currentY +=
      30 + descLines.length * this.doc.getLineHeight() * 0.8 + 10;
  }

  save(filename: string) {
    this.doc.save(filename);
  }
}
// --- End PDF Generation Helper Class ---

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  brandData,
  onStartOver,
}) => {
  const {
    /* ...destructure brandData as before... */ brand_communication,
    brand_identity,
    brand_strategy,
    marketing_and_social_media_strategy,
  } = brandData;

  // ... (calendar state and logic remain the same) ...
  const [calendarPage, setCalendarPage] = useState(0);
  const CALENDAR_ITEMS_PER_PAGE = 5;
  const contentCalendarEntries = useMemo((): CalendarEntry[] => {
    /* ... as before ... */
    const calendarString =
      marketing_and_social_media_strategy?.content_calender;
    if (!calendarString || typeof calendarString !== "string") return [];
    const lines = calendarString.trim().split("\n");
    if (lines.length <= 1) return [];
    const headerLine = lines[0];
    const headerKeys = headerLine
      .split("!@!")
      .map((key) =>
        key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[?!]/g, "")
      );
    const dataLines = lines.slice(1);
    return dataLines
      .map((line) => {
        const values = line.split("!@!");
        let entry: any = {};
        headerKeys.forEach((key, index) => {
          if (key) {
            entry[key] = values[index]?.trim() || "";
          }
        });
        return entry as CalendarEntry;
      })
      .filter((entry) => entry.date && entry.event);
  }, [marketing_and_social_media_strategy?.content_calender]);
  const totalCalendarPages = Math.ceil(
    contentCalendarEntries.length / CALENDAR_ITEMS_PER_PAGE
  );
  const paginatedCalendarEntries = contentCalendarEntries.slice(
    calendarPage * CALENDAR_ITEMS_PER_PAGE,
    (calendarPage + 1) * CALENDAR_ITEMS_PER_PAGE
  );
  const handleCalendarNextPage = () =>
    setCalendarPage((prev) => Math.min(prev + 1, totalCalendarPages - 1));
  const handleCalendarPrevPage = () =>
    setCalendarPage((prev) => Math.max(prev - 1, 0));

  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

const handleDownloadPdfProgrammatic = async () => {
  setIsGeneratingPdf(true);
  toast.loading("Generating your professional brand blueprint...", {
    id: "pdf-generation-prog",
  });

  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const builder = new ImprovedPdfBuilder(brandData);
    
    // Cover page
    builder.addCoverPage(
      "Brand Blueprint", 
      brand_communication?.brand_name,
      brand_communication?.brand_tagline
    );

    // Brand Communication Section
    if (brand_communication) {
      builder.addSectionTitle("Brand Communication", true);
      
      builder.addKeyValuePair("Brand Name", brand_communication.brand_name, true);
      builder.addKeyValuePair("Brand Tagline", brand_communication.brand_tagline, true);
      
      if (brand_communication.primary_core_message) {
        builder.addSectionTitle("Primary Core Message");
        builder.addKeyValuePair("Who We Serve", brand_communication.primary_core_message.who_we_serve);
        builder.addKeyValuePair("Where They Need Help", brand_communication.primary_core_message.where_they_need_help);
        builder.addKeyValuePair("Their Market Alternative", brand_communication.primary_core_message.their_market_alternative);
        builder.addKeyValuePair("Key Benefits They Get", brand_communication.primary_core_message.the_key_benefits_they_get);
        builder.addKeyValuePair("Our Key Differences", brand_communication.primary_core_message.our_key_differences);
      }
    }

    // Brand Strategy Section
    if (brand_strategy) {
      builder.addSectionTitle("Brand Strategy", true);
      
      if (brand_strategy.brand_substance) {
        builder.addSectionTitle("Brand Substance");
        
        if (brand_strategy.brand_substance.our_purpose) {
          builder.addKeyValuePair(
            brand_strategy.brand_substance.our_purpose.title || "Our Purpose",
            brand_strategy.brand_substance.our_purpose.purpose_statement,
            true
          );
          builder.addKeyValuePair(
            "What Customers Mean to Us",
            brand_strategy.brand_substance.our_purpose.what_our_customers_mean_to_us
          );
          builder.addKeyValuePair(
            "We Believe In Something Bigger",
            brand_strategy.brand_substance.our_purpose.we_believe_in_something_bigger_than_ourselves
          );
        }
        
        if (brand_strategy.brand_substance.our_vision) {
          builder.addKeyValuePair("Our Vision", brand_strategy.brand_substance.our_vision.our_vision_is_bright);
        }
        
        if (brand_strategy.brand_substance.our_mission) {
          builder.addKeyValuePair("Our Mission", brand_strategy.brand_substance.our_mission.we_are_committed_to);
        }
        
        if (brand_strategy.brand_substance.our_values) {
          builder.addKeyValuePair("Our Values", brand_strategy.brand_substance.our_values.values);
          builder.addKeyValuePair("Values in Action", brand_strategy.brand_substance.our_values.how_we_do_wellness_business);
        }
      }
      
      // Use the special customer persona method
      if (brand_strategy.our_position) {
        builder.addCustomerPersona(brand_strategy.our_position);
      }
      
      builder.addKeyValuePair("Competitive Analysis", brand_strategy.top_competitors);
      
      if (brand_strategy.why_we_are_different) {
        builder.addSectionTitle("What Makes Us Different");
        builder.addKeyValuePair("Positioning Statement", brand_strategy.why_we_are_different.positioning_statement, true);
        builder.addKeyValuePair("The Difference We Provide", brand_strategy.why_we_are_different.the_difference_we_provide);
      }
    }

    // Brand Identity Section
    if (brand_identity) {
      builder.addSectionTitle("Brand Identity", true);
      
      builder.addKeyValuePair("About The Brand", brand_identity.about_the_brand, true);
      
      // Color Palettes
      if (brand_identity.primary_colors?.length > 0) {
        builder.addColorPalette(brand_identity.primary_colors, "Primary Colors");
      }
      
      if (brand_identity.secondary_colors?.length > 0) {
        builder.addColorPalette(brand_identity.secondary_colors, "Secondary Colors");
      }
      
      // Typography
      if (brand_identity.typography?.length > 0) {
        builder.addSectionTitle("Typography");
        brand_identity.typography.forEach((font, index) => {
          builder.addKeyValuePair(
            `${font.font_family} ${font.font_weight}`,
            `Size: ${font.font_size} | Line Height: ${font.line_height}\n${font.description}`
          );
        });
      }
      
      // Logo information
      if (brand_identity.logos?.length > 0) {
        builder.addSectionTitle("Brand Logos");
        brand_identity.logos.forEach((logo, index) => {
          builder.addKeyValuePair(
            `Logo ${index + 1}`,
            logo.description || "Logo description not available"
          );
        });
      }
    }

    // Marketing & Social Media Section
    if (marketing_and_social_media_strategy && contentCalendarEntries.length > 0) {
      builder.addSectionTitle("Marketing & Social Media Strategy", true);
      builder.addContentCalendarSample(contentCalendarEntries, 5);
    }

    // Final note
    builder.addSectionTitle("Implementation Guide", true);
    builder.addKeyValuePair(
      "Next Steps",
      "This brand blueprint provides the foundation for all your marketing materials, website design, and business communications. Use these guidelines consistently across all touchpoints to build a strong, recognizable brand identity.",
      true
    );

    builder.save(`${brand_communication?.brand_name || 'brand_blueprint'}_professional.pdf`);
    toast.success("Professional PDF generated successfully!", {
      id: "pdf-generation-prog",
    });
    
  } catch (error) {
    console.error("Error generating enhanced PDF:", error);
    toast.error("Sorry, an error occurred while generating the PDF.", {
      id: "pdf-generation-prog",
    });
  } finally {
    setIsGeneratingPdf(false);
  }
};
  // --- JSX for screen display remains largely the same ---
  // It uses ResultSection and KeyValueDisplay for screen rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 print:bg-white">
      <div className="py-10 sm:py-16">
        {/* resultsContainerRef is now primarily for if you still want an html2canvas fallback or specific element reference */}
        <div
          ref={resultsContainerRef}
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg print:shadow-none print:rounded-none print:max-w-full"
        >
          <div className="text-center p-6 sm:p-10 md:p-12 border-b border-gray-200 print:border-none print:pt-6 print:pb-4">
            {/* ... Title and Subtitle ... */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 print:text-3xl">
              Your Brand Blueprint is Ready!
            </h1>
            <p className="text-md sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto print:text-base">
              Explore the comprehensive strategy and identity elements crafted
              for{" "}
              <span className="font-semibold text-blue-600">
                {brand_communication?.brand_name || "your brand"}
              </span>
              .
            </p>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {/* --- SECTIONS FOR SCREEN DISPLAY (using ResultSection and KeyValueDisplay) --- */}
            {brand_communication && (
              <ResultSection
                title="Brand Communication"
                icon={MessageSquare}
                defaultOpen={true}
              >
                {" "}
                {/* ... content ... */}{" "}
              </ResultSection>
            )}
            {brand_strategy && (
              <ResultSection
                title="Brand Strategy"
                icon={Target}
                defaultOpen={true}
              >
                {" "}
                {/* ... content ... */}{" "}
              </ResultSection>
            )}
            {brand_identity && (
              <ResultSection
                title="Brand Identity"
                icon={Palette}
                defaultOpen={true}
              >
                {" "}
                {/* ... content ... */}{" "}
              </ResultSection>
            )}
            {marketing_and_social_media_strategy && (
              <ResultSection
                title="Marketing & Social Media"
                icon={CalendarDays}
                defaultOpen={true}
              >
                <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-4 print:text-sm print:mb-2">
                  Content Calendar
                </h4>
                {contentCalendarEntries.length > 0 ? (
                  <>
                    <div className="overflow-x-auto bg-slate-50 p-2 rounded-lg border border-slate-200 shadow-sm mb-4 print:overflow-visible print:p-0 print:border-none print:shadow-none">
                      {/* ... table for paginatedCalendarEntries ... */}
                      <table className="min-w-full text-sm divide-y divide-gray-200 print:text-xs">
                        <thead className="bg-gray-100 print:bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600 print:px-1 print:py-1">
                              Date
                            </th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600 print:px-1 print:py-1">
                              Event
                            </th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600 print:px-1 print:py-1">
                              Caption
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paginatedCalendarEntries.map((entry, index) => (
                            <tr
                              key={index}
                              className="print:break-inside-avoid-page"
                            >
                              <td className="px-3 py-2 whitespace-nowrap text-gray-700 font-medium print:px-1 print:py-1">
                                {entry.date}
                              </td>
                              <td className="px-3 py-2 text-gray-700 print:px-1 print:py-1">
                                {entry.event}
                              </td>
                              <td className="px-3 py-2 text-gray-600 text-xs leading-snug max-w-md print:px-1 print:py-1 print:max-w-xs">
                                {entry.caption}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalCalendarPages > 1 && (
                      <div className="flex justify-between items-center mt-4 no-pdf">
                        {/* ... Pagination buttons ... */}
                        <button
                          onClick={handleCalendarPrevPage}
                          disabled={calendarPage === 0}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          {" "}
                          <ChevronLeft className="w-3 h-3" /> Prev{" "}
                        </button>
                        <span className="text-xs text-gray-500">
                          {" "}
                          Page {calendarPage + 1} of {totalCalendarPages}{" "}
                        </span>
                        <button
                          onClick={handleCalendarNextPage}
                          disabled={calendarPage >= totalCalendarPages - 1}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          {" "}
                          Next <ChevronRight className="w-3 h-3" />{" "}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600">
                    Content calendar information not available.
                  </p>
                )}
              </ResultSection>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pb-8 sm:pb-12 no-pdf">
            <button
              onClick={handleDownloadPdfProgrammatic} // <--- Call the new programmatic PDF function
              disabled={isGeneratingPdf}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full sm:w-auto disabled:opacity-70"
            >
              {isGeneratingPdf ? (
                <>
                  {" "}
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating PDF...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Download className="w-5 h-5" /> Download Package{" "}
                </>
              )}
            </button>
            <button
              onClick={onStartOver}
              disabled={isGeneratingPdf}
              className="px-8 py-3.5 border-2 border-gray-400 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 w-full sm:w-auto disabled:opacity-70"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
