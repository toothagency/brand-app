// ./components/results/ResultsDisplay.tsx
"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Palette,
  Target,
  MessageSquare,
  CalendarDays, // Renamed Calendar to CalendarDays
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Users,
  Briefcase,
  BarChart3,
  Edit3,
  Image as ImageIcon,
  Type,
  Droplet,
  ShoppingBag,
  Zap,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming Shadcn UI Button
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"; // Assuming Shadcn UI Card
import { Badge } from "@/components/ui/badge"; // Assuming Shadcn UI Badge
// import { Separator } from "@/components/ui/separator"; // Not used in current snippet, but keep if needed elsewhere
import { toast } from "react-hot-toast"; // Assuming Sonner for toasts
import type {
  DetailedBrandObject,
  BrandObjectColor,
  BrandObjectLogo,
  BrandObjectTypography,
  BrandObjectApplication,
} from "../../utils/types"; // Adjust path
import PdfBuilderWithImages from "../form/EnhancedPdfBuilder";
import { useCreateBrand } from "../../hooks/formHooks";
import Cookies from "js-cookie";

interface ResultsDisplayProps {
  brandData: DetailedBrandObject;
  onEdit: () => void; // For Edit button (just go back to form view)
  onStartOver: () => void; // For Start Over (clear everything)
}

type CalendarEntry = {
  date?: string;
  event?: string;
  design_concept?: string;
  caption?: string;
  platform?: string; // Added based on your UI
  content_type?: string; // Added
  hashtags?: string; // Added
  [key: string]: string | undefined; // To handle other potential dynamic keys
};

// Helper: SectionCard
const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  sectionKey: string;
  children: React.ReactNode;
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionKey: string) => void;
  elementId?: string;
}> = ({
  title,
  icon,
  sectionKey,
  children,
  expandedSections,
  toggleSection,
  elementId,
}) => {
  const contentId = elementId || `section-content-${sectionKey}`;
  return (
    <Card className="w-full overflow-hidden print:shadow-none print:border-none">
      <CardHeader
        className="cursor-pointer hover:bg-slate-50 transition-colors p-4 sm:p-6 print:py-3 print:px-2"
        onClick={() => toggleSection(sectionKey)}
        role="button"
        aria-expanded={expandedSections[sectionKey]}
        aria-controls={contentId}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-gray-800 print:text-lg">
            {icon}
            {title}
          </CardTitle>
          {expandedSections[sectionKey] ? (
            <ChevronUp className="print:hidden" />
          ) : (
            <ChevronDown className="print:hidden" />
          )}
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {expandedSections[sectionKey] && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            id={contentId}
            className="print:!h-auto print:!opacity-100 print:!overflow-visible" // Ensure visible for print
          >
            <CardContent className="pt-0 p-4 sm:p-6 print:p-2">
              {children}
            </CardContent>
          </motion.section>
        )}
      </AnimatePresence>
    </Card>
  );
};

// Helper: ColorPalette Display
const ColorPaletteDisplay: React.FC<{
  colors?: BrandObjectColor[];
  title: string;
}> = ({ colors, title }) => {
  if (!colors || colors.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No {title.toLowerCase()} specified.
      </p>
    );
  }
  return (
    <div className="mb-6">
      <h4 className="font-semibold text-lg mb-3 text-gray-700 print:text-base">
        {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200 print:p-2 print:gap-2"
          >
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-md border-2 border-gray-200 shadow-sm flex-shrink-0 print:w-10 print:h-10"
              style={{ backgroundColor: color.hex_value }}
            />
            <div className="flex-1">
              <h5 className="font-medium text-gray-900 print:text-sm">
                {color.color_name}
              </h5>
              <p className="text-sm text-gray-600 font-mono print:text-xs">
                {color.hex_value}
              </p>
              {color.description && (
                <p className="text-xs text-gray-500 mt-1 print:hidden">
                  {color.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper: KeyValue for PDF Builder (simplified)
const renderKeyValueForPdf = (
  builder: PdfBuilderWithImages,
  label: string,
  value: any,
  isTopLevel = false
) => {
  if (value !== undefined && value !== null && String(value).trim() !== "") {
    builder.addKeyValuePair(
      label,
      Array.isArray(value) ? value.join(", ") : String(value),
      isTopLevel
    );
  }
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  brandData,
  onEdit,
  onStartOver,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    communication: true, // Default some to open
    strategy: false,
    identity: false,
    marketing: false,
  });
  const [contentCalendarEntries, setContentCalendarEntries] = useState<
    CalendarEntry[]
  >([]);
  const [showAllCalendarEntries, setShowAllCalendarEntries] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const createBrandMutation = useCreateBrand();

  const {
    brand_communication,
    brand_strategy,
    brand_identity,
    marketing_and_social_media_strategy,
  } = brandData;

  useEffect(() => {
    if (marketing_and_social_media_strategy?.content_calender) {
      // Note: key is content_calender from sample
      try {
        const calendarString =
          marketing_and_social_media_strategy.content_calender;
        const lines = calendarString.trim().split("\n");
        if (lines.length <= 1) {
          setContentCalendarEntries([]);
          return;
        }

        const headerLine = lines[0];
        const headerKeys = headerLine.split("!@!").map(
          (key) =>
            key
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[?!(),.:]/g, "") // Further sanitize keys
        );

        const dataLines = lines.slice(1);
        const entries = dataLines
          .map((line) => {
            const values = line.split("!@!");
            let entry: CalendarEntry = {};
            headerKeys.forEach((key, index) => {
              if (key) {
                entry[key] = values[index]?.trim() || "";
              }
            });
            return entry;
          })
          .filter((entry) => entry.date && entry.event);

        setContentCalendarEntries(entries);
      } catch (error) {
        console.error("Error parsing content calendar:", error);
        setContentCalendarEntries([]);
      }
    }
  }, [marketing_and_social_media_strategy]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDownloadPdfProgrammatic = async () => {
    setIsGeneratingPdf(true);
    toast.loading(
      "Generating your professional brand blueprint with images...",
      {
        id: "pdf-generation-prog",
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const builder = new PdfBuilderWithImages(brandData);

      // Cover page
      builder.addCoverPage(
        "Brand Blueprint",
        brand_communication?.brand_name,
        brand_communication?.brand_tagline
      );

      // Brand Communication Section
      if (brand_communication) {
        builder.addSectionTitle("Brand Communication", true);

        builder.addKeyValuePair(
          "Brand Name",
          brand_communication.brand_name,
          true
        );
        builder.addKeyValuePair(
          "Brand Tagline",
          brand_communication.brand_tagline,
          true
        );

        if (brand_communication.primary_core_message) {
          builder.addSectionTitle("Primary Core Message");
          builder.addKeyValuePair(
            "Who We Serve",
            brand_communication.primary_core_message.who_we_serve
          );
          builder.addKeyValuePair(
            "Where They Need Help",
            brand_communication.primary_core_message.where_they_need_help
          );
          builder.addKeyValuePair(
            "Their Market Alternative",
            brand_communication.primary_core_message.their_market_alternative
          );
          builder.addKeyValuePair(
            "Key Benefits They Get",
            brand_communication.primary_core_message.the_key_benefits_they_get
          );
          builder.addKeyValuePair(
            "Our Key Differences",
            brand_communication.primary_core_message.our_key_differences
          );
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
              brand_strategy.brand_substance.our_purpose
                .what_our_customers_mean_to_us
            );
            builder.addKeyValuePair(
              "We Believe In Something Bigger",
              brand_strategy.brand_substance.our_purpose
                .we_believe_in_something_bigger_than_ourselves
            );
          }

          if (brand_strategy.brand_substance.our_vision) {
            builder.addKeyValuePair(
              "Our Vision",
              brand_strategy.brand_substance.our_vision.our_vision_is_bright
            );
          }

          if (brand_strategy.brand_substance.our_mission) {
            builder.addKeyValuePair(
              "Our Mission",
              brand_strategy.brand_substance.our_mission.we_are_committed_to
            );
          }

          if (brand_strategy.brand_substance.our_values) {
            builder.addKeyValuePair(
              "Our Values",
              brand_strategy.brand_substance.our_values.values
            );
            builder.addKeyValuePair(
              "Values in Action",
              brand_strategy.brand_substance.our_values
                .how_we_do_wellness_business
            );
          }
        }

        // Use the special customer persona method
        if (brand_strategy.our_position) {
          builder.addCustomerPersona(brand_strategy.our_position);
        }

        builder.addKeyValuePair(
          "Competitive Analysis",
          brand_strategy.top_competitors
        );

        if (brand_strategy.why_we_are_different) {
          builder.addSectionTitle("What Makes Us Different");
          builder.addKeyValuePair(
            "Positioning Statement",
            brand_strategy.why_we_are_different.positioning_statement,
            true
          );
          builder.addKeyValuePair(
            "The Difference We Provide",
            brand_strategy.why_we_are_different.the_difference_we_provide
          );
        }
      }

      // Brand Identity Section
      if (brand_identity) {
        builder.addSectionTitle("Brand Identity", true);

        builder.addKeyValuePair(
          "About The Brand",
          brand_identity.about_the_brand,
          true
        );

        // Color Palettes
        if (brand_identity.primary_colors?.length > 0) {
          builder.addColorPalette(
            brand_identity.primary_colors,
            "Primary Colors"
          );
        }

        if (brand_identity.secondary_colors?.length > 0) {
          builder.addColorPalette(
            brand_identity.secondary_colors,
            "Secondary Colors"
          );
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

        // Logo images
        if (brand_identity.logos?.length > 0) {
          await builder.addLogosWithImages(brand_identity.logos);
        }
      }

      // Marketing & Social Media Section
      if (
        marketing_and_social_media_strategy &&
        contentCalendarEntries.length > 0
      ) {
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

      builder.save(
        `${brand_communication?.brand_name || "brand_blueprint"}_with_logos.pdf`
      );
      toast.success("Professional PDF with logos generated successfully!", {
        id: "pdf-generation-prog",
      });
    } catch (error) {
      console.error("Error generating PDF with images:", error);
      toast.error("Sorry, an error occurred while generating the PDF.", {
        id: "pdf-generation-prog",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Helper to get userId from cookies
  const getUserId = () => {
    const userDataCookie = Cookies.get("userData");
    if (!userDataCookie) return null;
    try {
      const parsedData = JSON.parse(userDataCookie);
      return parsedData?.userId || null;
    } catch (error) {
      return null;
    }
  };

  const handleStartOver = () => {
    setShowPopover(true);
  };

  const handlePopoverClose = () => {
    setShowPopover(false);
  };

  const handleStartOverNo = () => {
    // Do NOT clear localStorage here. Just close popover and go back to form.
    setShowPopover(false);
    onStartOver();
  };

  const handleStartOverYes = async () => {
    setIsSaving(true);
    const userId = getUserId();
    if (userId) {
      try {
        localStorage.removeItem("brandingFormData");

        await createBrandMutation.mutateAsync({ userId });
        setShowPopover(false);
        onStartOver();
      } catch (error) {
        toast.error("Failed to save brand before starting over.");
      }
    } else {
      toast.error("User not found. Cannot save brand.");
    }
    setIsSaving(false);
  };

  const handleEdit = () => {
    setShowPopover(false);
    onEdit();
  };

  // --- UI Rendering ---
  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8 print:bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-8 pb-12 print:pt-4 print:pb-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 print:text-3xl">
            Your Brand Blueprint
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 print:text-base">
            Comprehensive strategy for{" "}
            <span className="font-semibold text-blue-600">
              {brand_communication?.brand_name || "your business"}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 no-pdf">
            {" "}
            {/* Buttons hidden in PDF */}
            <Button
              onClick={handleDownloadPdfProgrammatic}
              disabled={isGeneratingPdf}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              {isGeneratingPdf ? "Generating PDF..." : "Download Blueprint"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleStartOver}
              className="w-full sm:w-auto"
            >
              Back to Form
            </Button>
          </div>
        </motion.div>
        <div className="space-y-6 print:space-y-3">
          {/* Brand Communication Section */}
          {brand_communication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <SectionCard
                title="Brand Communication"
                icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
                sectionKey="communication"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-1">
                        Brand Name
                      </h4>
                      <p className="text-2xl font-bold text-blue-700">
                        {brand_communication.brand_name}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-1">
                        Brand Tagline
                      </h4>
                      <p className="text-lg italic text-gray-700">
                        "{brand_communication.brand_tagline}"
                      </p>
                    </div>
                  </div>
                  {brand_communication.primary_core_message && (
                    <Card className="bg-slate-50/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-slate-800">
                          Primary Core Message
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm text-slate-700">
                        <p>
                          <strong className="text-slate-600">
                            Who We Serve:
                          </strong>{" "}
                          {
                            brand_communication.primary_core_message
                              .who_we_serve
                          }
                        </p>
                        <p>
                          <strong className="text-slate-600">
                            Where They Need Help:
                          </strong>{" "}
                          {
                            brand_communication.primary_core_message
                              .where_they_need_help
                          }
                        </p>
                        <p>
                          <strong className="text-slate-600">
                            Market Alternative:
                          </strong>{" "}
                          {
                            brand_communication.primary_core_message
                              .their_market_alternative
                          }
                        </p>
                        <p>
                          <strong className="text-slate-600">
                            Key Benefits:
                          </strong>{" "}
                          {
                            brand_communication.primary_core_message
                              .the_key_benefits_they_get
                          }
                        </p>
                        <p>
                          <strong className="text-slate-600">
                            Our Key Differences:
                          </strong>{" "}
                          {
                            brand_communication.primary_core_message
                              .our_key_differences
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Brand Strategy Section */}
          {brand_strategy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <SectionCard
                title="Brand Strategy"
                icon={<Target className="w-6 h-6 text-green-600" />}
                sectionKey="strategy"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-8">
                  {brand_strategy.brand_substance && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Brand Substance
                      </h3>
                      <div className="space-y-4">
                        {brand_strategy.brand_substance.our_purpose && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-md">
                                {brand_strategy.brand_substance.our_purpose
                                  .title || "Our Purpose"}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm">
                              {
                                brand_strategy.brand_substance.our_purpose
                                  .purpose_statement
                              }
                            </CardContent>
                          </Card>
                        )}
                        {/* Add more KeyValueDisplay or Card for other substance parts */}
                        <KeyValueDisplay
                          label="Vision"
                          value={
                            brand_strategy.brand_substance.our_vision
                              ?.our_vision_is_bright
                          }
                        />
                        <KeyValueDisplay
                          label="Mission"
                          value={
                            brand_strategy.brand_substance.our_mission
                              ?.we_are_committed_to
                          }
                        />
                        <KeyValueDisplay
                          label="Values"
                          value={brand_strategy.brand_substance.our_values?.values.join(
                            ", "
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {brand_strategy.our_position && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Ideal Customer: {brand_strategy.our_position.name}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-md">
                              Demographics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {brand_strategy.our_position.demographics}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-md">
                              Psychographics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {brand_strategy.our_position.psychographics}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-md">
                              Personality
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {brand_strategy.our_position.personality}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-md">Desires</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {brand_strategy.our_position.desires}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-md">Fears</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {brand_strategy.our_position.fears}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-md">
                              Challenges
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {
                              brand_strategy.our_position
                                .challenges_and_pain_points
                            }
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                  <KeyValueDisplay
                    label="Competitive Analysis"
                    value={brand_strategy.top_competitors}
                  />
                  {brand_strategy.why_we_are_different && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Our Differentiation
                      </h3>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-md">
                            Positioning Statement
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          {
                            brand_strategy.why_we_are_different
                              .positioning_statement
                          }
                        </CardContent>
                      </Card>
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle className="text-md">
                            The Difference We Provide
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          {
                            brand_strategy.why_we_are_different
                              .the_difference_we_provide
                          }
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Brand Identity Section */}
          {brand_identity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <SectionCard
                title="Brand Identity"
                icon={<Palette className="w-6 h-6 text-purple-600" />}
                sectionKey="identity"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-8">
                  <KeyValueDisplay
                    label="About The Brand"
                    value={brand_identity.about_the_brand}
                  />
                  <ColorPaletteDisplay
                    colors={brand_identity.primary_colors}
                    title="Primary Colors"
                  />
                  <ColorPaletteDisplay
                    colors={brand_identity.secondary_colors}
                    title="Secondary Colors"
                  />

                  {brand_identity.typography &&
                    brand_identity.typography.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          Typography
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {brand_identity.typography.map((font, index) => (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle
                                  className="text-lg"
                                  style={{
                                    fontFamily: font.font_family,
                                    fontWeight: font.font_weight as any,
                                  }}
                                >
                                  {font.font_family} ({font.font_weight})
                                </CardTitle>
                                <CardDescription>
                                  Size: {font.font_size} | Line Height:{" "}
                                  {font.line_height}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="text-sm">
                                {font.description}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                  {brand_identity.logos && brand_identity.logos.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Brand Logos
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {brand_identity.logos.map((logo, index) => (
                          <Card key={index} className="flex flex-col">
                            <CardContent className="p-4 flex-grow flex flex-col items-center justify-center bg-slate-50">
                              {logo.image_url ? (
                                <img
                                  src={logo.image_url}
                                  alt={`Logo ${index + 1}`}
                                  className="max-w-full max-h-40 object-contain"
                                />
                              ) : (
                                <p className="text-gray-400 text-sm">
                                  No image
                                </p>
                              )}
                            </CardContent>
                            <CardHeader className="pt-3 pb-4">
                              <CardDescription className="text-xs">
                                {logo.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* TODO: Add Applications display */}
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* Marketing & Social Media Section */}
          {marketing_and_social_media_strategy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <SectionCard
                title="Marketing & Social Media"
                icon={<CalendarDays className="w-6 h-6 text-orange-600" />}
                sectionKey="marketing"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="space-y-6">
                  {contentCalendarEntries.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Content Calendar
                        </h3>
                        {contentCalendarEntries.length > 5 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setShowAllCalendarEntries(!showAllCalendarEntries)
                            }
                          >
                            {showAllCalendarEntries ? (
                              <EyeOff className="w-4 h-4 mr-2" />
                            ) : (
                              <Eye className="w-4 h-4 mr-2" />
                            )}
                            {showAllCalendarEntries
                              ? "Show Less"
                              : `Show All (${contentCalendarEntries.length})`}
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {(showAllCalendarEntries
                          ? contentCalendarEntries
                          : contentCalendarEntries.slice(0, 3)
                        ).map((entry, index) => (
                          <motion.div
                            key={index}
                            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {entry.date || "N/A"}
                              </Badge>
                              {entry.platform && (
                                <Badge variant="outline" className="text-xs">
                                  {entry.platform}
                                </Badge>
                              )}
                            </div>
                            <h5 className="font-medium text-gray-800 mb-1">
                              {entry.event || "Event Title"}
                            </h5>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                              {entry.caption || "No caption"}
                            </p>
                            <div className="text-xs text-gray-500 flex items-center gap-3">
                              {entry.content_type && (
                                <span>Type: {entry.content_type}</span>
                              )}
                              {entry.hashtags && (
                                <span>
                                  Hashtags:{" "}
                                  {entry.hashtags
                                    .split(" ")
                                    .slice(0, 3)
                                    .join(" ")}
                                  {entry.hashtags.split(" ").length > 3
                                    ? "..."
                                    : ""}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* TODO: Add other marketing strategy details if present in your DetailedBrandObject */}
                </div>
              </SectionCard>
            </motion.div>
          )}
        </div>{" "}
        {/* End of space-y-6 for sections */}
      </div>{" "}
      {/* End of max-w-5xl */}
     
      {showPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">

            <h3 className="text-lg font-semibold ">Edit or Start Over?</h3>
            <Button variant="outline" className="p-2 w-6 h-6" onClick={handlePopoverClose}> <X className="w-4 h-4" /></Button>
            </div>
            <p className="mb-6">Do you want to Edit this brand or Create A New Brand ?</p>
            <div className="flex justify-end gap-4">
              <Button onClick={handleEdit} variant="secondary" disabled={isSaving}>
                Edit
              </Button>
              <Button onClick={handleStartOverYes} disabled={isSaving}>
                {isSaving ? "Saving..." : "Start Over"}
              </Button>
            </div>
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
              onClick={handlePopoverClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
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
}> = ({ label, value, className = "", isHtml = false }) => {
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
    ) : isHtml ? (
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
export default React.memo(ResultsDisplay);
