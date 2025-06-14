"use client";
import React, { useState, useRef, useMemo } from "react"; // Added useMemo
import type { DetailedBrandObject } from "../../utils/types"; // Adjust path to your types
import {
  Download, Share2, MessageSquare, Target, Palette, FileText, Users, Briefcase,
  BarChart3, Edit3, Image as ImageIcon, Type, Droplet, ShoppingBag, CalendarDays, Zap,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, // For pagination & collapsible
  Loader2 // For PDF generation loading
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from "react-hot-toast"; // For PDF generation feedback

interface ResultsDisplayProps {
  brandData: DetailedBrandObject;
  onStartOver: () => void;
}

// Helper component for rendering collapsible sections
const ResultSection: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode; defaultOpen?: boolean; elementId?: string; }> = 
    ({ title, icon: Icon, children, defaultOpen = true, elementId }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const sectionId = elementId || `section-content-${title.replace(/\s+/g, '-')}`;

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 transition-all duration-300 ease-in-out hover:shadow-2xl print:shadow-none print:mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-t-xl print:cursor-default print:py-4"
        aria-expanded={isOpen}
        aria-controls={sectionId}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 print:text-gray-700" />}
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 print:text-xl">{title}</h3>
        </div>
        {isOpen ? <ChevronUp className="w-6 h-6 text-gray-500 print:hidden" /> : <ChevronDown className="w-6 h-6 text-gray-500 print:hidden" />}
      </button>
      {/* For PDF generation, we might want to force content to be visible if isOpen is false, controlled by a prop or context */}
      {/* Or ensure sections are opened programmatically before html2canvas runs */}
      {/* The current PDF generation logic attempts to click buttons to open sections */}
      {isOpen && (
        <div id={sectionId} className="p-5 sm:p-6 border-t border-gray-200 print:border-t-0 print:px-2 print:py-3">
          {children}
        </div>
      )}
    </div>
  );
};

// Helper for key-value pairs
const KeyValueDisplay: React.FC<{ label: string; value: string | string[] | undefined | null; className?: string; isHtml?: boolean }> = 
    ({ label, value, className = "", isHtml = false }) => {
  const displayValue = value === undefined || value === null || (typeof value === 'string' && value.trim() === "") || (Array.isArray(value) && value.length === 0)
    ? <p className="text-gray-500 italic text-sm print:text-xs">Not available</p>
    : Array.isArray(value)
    ? (
        <ul className="list-disc list-inside text-gray-700 space-y-1 pl-1 print:text-sm print:space-y-0.5">
          {value.map((item, i) => <li key={i} className="text-gray-700 leading-relaxed print:text-sm">{item}</li>)}
        </ul>
      )
    : isHtml
    ? <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none print:text-sm print:prose-xs" dangerouslySetInnerHTML={{ __html: value }} />
    : <p className="text-gray-700 leading-relaxed whitespace-pre-wrap print:text-sm">{value}</p>;

  return (
    <div className={`mb-4 print:mb-2 ${className}`}>
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1.5 print:text-xs print:mb-1">{label}</h4>
      {displayValue}
    </div>
  );
};

type CalendarEntry = { date: string; event: string; design_concept: string; caption: string; [key: string]: string };


// Main ResultsDisplay Component
const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ brandData, onStartOver }) => {
  const {
    brandId, // Assuming brandId is at the root of DetailedBrandObject
    brand_communication,
    brand_identity,
    brand_strategy,
    marketing_and_social_media_strategy,
    userId
  } = brandData;

  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const [calendarPage, setCalendarPage] = useState(0);
  const CALENDAR_ITEMS_PER_PAGE = 5;

  const contentCalendarEntries = useMemo((): CalendarEntry[] => {
    const calendarString = marketing_and_social_media_strategy?.content_calender;
    if (!calendarString || typeof calendarString !== 'string') return [];
    const lines = calendarString.trim().split('\n');
    if (lines.length <= 1) return [];
    
    const headerLine = lines[0];
    // Sanitize header keys: lowercase, replace spaces with underscores, remove special chars like '?!'
    const headerKeys = headerLine.split('!@!').map(key => 
        key.trim().toLowerCase().replace(/\s+/g, '_').replace(/[?!]/g, '')
    );
    
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      const values = line.split('!@!');
      let entry: any = {}; // Use 'any' temporarily for dynamic key assignment
      headerKeys.forEach((key, index) => {
        if (key) { // Ensure key is not empty after sanitization
            entry[key] = values[index]?.trim() || '';
        }
      });
      return entry as CalendarEntry; // Cast to the expected type
    }).filter(entry => entry.date && entry.event); // Basic validation: ensure date and event exist
  }, [marketing_and_social_media_strategy?.content_calender]);

  const totalCalendarPages = Math.ceil(contentCalendarEntries.length / CALENDAR_ITEMS_PER_PAGE);
  const paginatedCalendarEntries = contentCalendarEntries.slice(
    calendarPage * CALENDAR_ITEMS_PER_PAGE,
    (calendarPage + 1) * CALENDAR_ITEMS_PER_PAGE
  );

  const handleCalendarNextPage = () => setCalendarPage(prev => Math.min(prev + 1, totalCalendarPages - 1));
  const handleCalendarPrevPage = () => setCalendarPage(prev => Math.max(prev - 1, 0));

  const handleDownloadPdf = async () => {
    if (!resultsContainerRef.current) {
      toast.error("Cannot generate PDF: Report content not found.");
      return;
    }
    setIsGeneratingPdf(true);
    toast.loading("Generating PDF, please wait...", { id: "pdf-generation" });

    const elementToCapture = resultsContainerRef.current;
    
    // Ensure all collapsible sections are open for PDF capture
    const collapsibleButtons = elementToCapture.querySelectorAll('button[aria-expanded="false"]');
    collapsibleButtons.forEach(button => (button as HTMLElement).click());

    // Wait for sections to expand and images/fonts to potentially load
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 1.5, // Adjust scale for quality vs. performance/size
        useCORS: true,
        logging: false, // Set to true for debugging html2canvas issues
        scrollY: -window.scrollY, // Capture from the top of the element
        windowWidth: elementToCapture.scrollWidth,
        windowHeight: elementToCapture.scrollHeight,
        onclone: (document:any) => {
          // Hide elements not needed in PDF using a class
          document.querySelectorAll('.no-pdf').forEach((el: Element) => {
            (el as HTMLElement).style.display = 'none';
          });
          // Ensure collapsible sections are open in the cloned document for capture
          document.querySelectorAll('button[aria-expanded="false"]').forEach((button: Element) => {
            const contentId = button.getAttribute('aria-controls');
            if (contentId) {
                const contentElement = document.getElementById(contentId);
                if (contentElement) {
                    // This direct style manipulation on clone might not always work as expected with html2canvas
                    // The click() method before cloning is generally more reliable
                }
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt', // points are better for web content scaling
        format: 'a4',
        putOnlyUsedFonts: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate the aspect ratio
      const ratio = canvasWidth / canvasHeight;
      
      let imgWidthInPdf = pdfWidth - 20; // With some margin
      let imgHeightInPdf = imgWidthInPdf / ratio;
      
      let heightLeft = imgHeightInPdf;
      let position = 10; // Top margin

      pdf.addImage(imgData, 'PNG', 10, position, imgWidthInPdf, imgHeightInPdf);
      heightLeft -= (pdfHeight - 20); // Subtract first page height (considering margins)

      while (heightLeft > 0) {
        position -= (pdfHeight - 20);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidthInPdf, imgHeightInPdf);
        heightLeft -= (pdfHeight - 20);
      }
      
      pdf.save(`${brand_communication?.brand_name || 'brand_blueprint'}_results.pdf`);
      toast.success("PDF downloaded successfully!", { id: "pdf-generation" });

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Sorry, an error occurred while generating the PDF.", { id: "pdf-generation" });
    } finally {
      setIsGeneratingPdf(false);
      // Optionally, attempt to re-collapse sections if needed, though this can be complex
      // It might be better to instruct the user or let them manually re-collapse.
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 print:bg-white">
      {/* This outer div is for screen display, PDF captures resultsContainerRef */}
      <div className="py-10 sm:py-16"> {/* Added padding for screen view */}
        {/* This ref is for the content to be converted to PDF */}
        <div ref={resultsContainerRef} className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg print:shadow-none print:rounded-none print:max-w-full">
          <div className="text-center p-6 sm:p-10 md:p-12 border-b border-gray-200 print:border-none print:pt-6 print:pb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 print:text-3xl">
              Your Brand Blueprint is Ready!
            </h1>
            <p className="text-md sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto print:text-base">
              Explore the comprehensive strategy and identity elements crafted for <span className="font-semibold text-blue-600">{brand_communication?.brand_name || "your brand"}</span>.
            </p>
          </div>

          <div className="p-4 sm:p-6 md:p-8"> {/* Padding for the content sections */}
            {brand_communication && (
              <ResultSection title="Brand Communication" icon={MessageSquare} defaultOpen={true}>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <KeyValueDisplay label="Brand Name" value={brand_communication.brand_name} />
                  <KeyValueDisplay label="Brand Tagline" value={brand_communication.brand_tagline} />
                </div>
                {brand_communication.primary_core_message && (
                  <>
                    <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mt-8 mb-3 print:text-sm print:mt-4 print:mb-1.5">Primary Core Message</h4>
                    <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200 print:bg-transparent print:p-0 print:border-none">
                      <KeyValueDisplay label="Who We Serve" value={brand_communication.primary_core_message.who_we_serve} />
                      <KeyValueDisplay label="Where They Need Help" value={brand_communication.primary_core_message.where_they_need_help} />
                      <KeyValueDisplay label="Their Market Alternative" value={brand_communication.primary_core_message.their_market_alternative} />
                      <KeyValueDisplay label="The Key Benefits They Get" value={brand_communication.primary_core_message.the_key_benefits_they_get} />
                      <KeyValueDisplay label="Our Key Differences" value={brand_communication.primary_core_message.our_key_differences} />
                    </div>
                  </>
                )}
              </ResultSection>
            )}

            {brand_strategy && (
              <ResultSection title="Brand Strategy" icon={Target} defaultOpen={true}> {/* Opened for PDF */}
                {brand_strategy.brand_substance && (
                    <>
                    <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-3 print:text-sm print:mb-1.5">Brand Substance</h4>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200 print:bg-transparent print:p-0 print:border-none">
                        <KeyValueDisplay label={brand_strategy.brand_substance.our_purpose?.title || "Our Purpose"} value={brand_strategy.brand_substance.our_purpose?.purpose_statement} />
                        <KeyValueDisplay label="What Customers Mean to Us" value={brand_strategy.brand_substance.our_purpose?.what_our_customers_mean_to_us} />
                        <KeyValueDisplay label="Our Vision" value={brand_strategy.brand_substance.our_vision?.our_vision_is_bright} />
                        <KeyValueDisplay label="Our Mission" value={brand_strategy.brand_substance.our_mission?.we_are_committed_to} />
                        <KeyValueDisplay label="Our Values" value={brand_strategy.brand_substance.our_values?.values} />
                        <KeyValueDisplay label="Values in Action" value={brand_strategy.brand_substance.our_values?.how_we_do_wellness_business} />
                        <KeyValueDisplay label="We Believe In Something Bigger" value={brand_strategy.brand_substance.our_purpose?.we_believe_in_something_bigger_than_ourselves} />
                    </div>
                    </>
                )}
                {brand_strategy.our_position && (
                    <>
                    <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-3 print:text-sm print:mb-1.5">Ideal Customer Persona: {brand_strategy.our_position.name || "N/A"}</h4>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200 print:bg-transparent print:p-0 print:border-none">
                        <KeyValueDisplay label="Demographics" value={brand_strategy.our_position.demographics} />
                        <KeyValueDisplay label="Psychographics" value={brand_strategy.our_position.psychographics} />
                        <KeyValueDisplay label="Personality" value={brand_strategy.our_position.personality} />
                        <KeyValueDisplay label="Desires" value={brand_strategy.our_position.desires} />
                        <KeyValueDisplay label="Fears" value={brand_strategy.our_position.fears} />
                        <KeyValueDisplay label="Challenges & Pain Points" value={brand_strategy.our_position.challenges_and_pain_points} />
                    </div>
                    </>
                )}
                <KeyValueDisplay label="Top Competitors Analysis" value={brand_strategy.top_competitors} className="mb-6"/>
                {brand_strategy.why_we_are_different && (
                    <>
                    <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-3 print:text-sm print:mb-1.5">Why We Are Different</h4>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 print:bg-transparent print:p-0 print:border-none">
                        <KeyValueDisplay label="Positioning Statement" value={brand_strategy.why_we_are_different.positioning_statement} />
                        <KeyValueDisplay label="The Difference We Provide" value={brand_strategy.why_we_are_different.the_difference_we_provide} />
                    </div>
                    </>
                )}
              </ResultSection>
            )}

            {brand_identity && (
              <ResultSection title="Brand Identity" icon={Palette} defaultOpen={true}> {/* Opened for PDF */}
                <KeyValueDisplay label="About The Brand" value={brand_identity.about_the_brand} className="mb-8"/>
                
                {brand_identity.logos?.length > 0 && (
                  <>
                    <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mt-6 mb-4 print:text-sm print:mt-3 print:mb-2">Logos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 print:grid-cols-2 print:gap-4">
                      {brand_identity.logos.map((logo, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-slate-50 flex flex-col print:p-2 print:shadow-none print:border-gray-300">
                          {logo.image_url ? (
                            <img src={logo.image_url} alt={`Logo ${index + 1}`} className="w-full h-40 object-contain rounded mb-3 bg-white p-2 border print:h-32" />
                          ) : ( <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded mb-3 text-gray-400 text-sm print:h-32">No Image</div> )}
                          <p className="text-sm text-gray-600 leading-relaxed flex-grow print:text-xs">{logo.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {/* ... (Logo Variants, Color Palette, Typography, Applications - similar optional chaining and mapping) ... */}
                 <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mt-6 mb-4 print:text-sm print:mt-3 print:mb-2">Color Palette</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <div> <h5 className="text-base font-semibold text-gray-600 mb-3 print:text-sm">Primary Colors</h5> {brand_identity.primary_colors?.map(color => ( <div key={color.hex_value} className="flex items-start gap-4 mb-4 p-3 border rounded-md bg-slate-50 print:p-2 print:gap-2"> <div style={{ backgroundColor: color.hex_value }} className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm flex-shrink-0 print:w-8 print:h-8"></div> <div className="flex-1"> <p className="font-semibold text-gray-800 print:text-sm">{color.color_name} <span className="text-xs font-normal text-gray-500 print:hidden">({color.hex_value})</span></p> <p className="text-xs text-gray-600 leading-snug print:hidden">{color.description}</p> </div> </div> ))} </div>
                <div> <h5 className="text-base font-semibold text-gray-600 mb-3 print:text-sm">Secondary Colors</h5> {brand_identity.secondary_colors?.map(color => ( <div key={color.hex_value} className="flex items-start gap-4 mb-4 p-3 border rounded-md bg-slate-50 print:p-2 print:gap-2"> <div style={{ backgroundColor: color.hex_value }} className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm flex-shrink-0 print:w-8 print:h-8"></div> <div className="flex-1"> <p className="font-semibold text-gray-800 print:text-sm">{color.color_name} <span className="text-xs font-normal text-gray-500 print:hidden">({color.hex_value})</span></p> <p className="text-xs text-gray-600 leading-snug print:hidden">{color.description}</p> </div> </div> ))} </div>
                </div>
                {/* ... etc. for Typography and Applications */}
              </ResultSection>
            )}

            {marketing_and_social_media_strategy && (
              <ResultSection title="Marketing & Social Media" icon={CalendarDays} defaultOpen={true}> {/* Opened for PDF */}
                <h4 className="text-md font-semibold text-gray-700 uppercase tracking-wider mb-4 print:text-sm print:mb-2">Content Calendar</h4>
                {contentCalendarEntries.length > 0 ? (
                  <>
                    <div className="overflow-x-auto bg-slate-50 p-2 rounded-lg border border-slate-200 shadow-sm mb-4 print:overflow-visible print:p-0 print:border-none print:shadow-none">
                      <table className="min-w-full text-sm divide-y divide-gray-200 print:text-xs">
                        <thead className="bg-gray-100 print:bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600 print:px-1 print:py-1">Date</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600 print:px-1 print:py-1">Event</th>
                            <th className="px-3 py-2 text-left font-semibold text-gray-600 print:px-1 print:py-1">Caption</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paginatedCalendarEntries.map((entry, index) => (
                            <tr key={index} className="print:break-inside-avoid-page">
                              <td className="px-3 py-2 whitespace-nowrap text-gray-700 font-medium print:px-1 print:py-1">{entry.date}</td>
                              <td className="px-3 py-2 text-gray-700 print:px-1 print:py-1">{entry.event}</td>
                              <td className="px-3 py-2 text-gray-600 text-xs leading-snug max-w-md print:px-1 print:py-1 print:max-w-xs">{entry.caption}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalCalendarPages > 1 && (
                      <div className="flex justify-between items-center mt-4 no-pdf">
                        <button onClick={handleCalendarPrevPage} disabled={calendarPage === 0} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"> <ChevronLeft className="w-3 h-3" /> Prev </button>
                        <span className="text-xs text-gray-500"> Page {calendarPage + 1} of {totalCalendarPages} </span>
                        <button onClick={handleCalendarNextPage} disabled={calendarPage >= totalCalendarPages - 1} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"> Next <ChevronRight className="w-3 h-3" /> </button>
                      </div>
                    )}
                  </>
                ) : ( <p className="text-gray-600">Content calendar information not available.</p> )}
              </ResultSection>
            )}
          </div> {/* End of inner padding div */}
        </div> {/* End of resultsContainerRef div */}

        {/* Action Buttons - Placed outside the ref so they don't appear in PDF */}
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pb-8 sm:pb-12 no-pdf">
            <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-full sm:w-auto disabled:opacity-70"
            >
                {isGeneratingPdf ? ( <> <Loader2 className="w-5 h-5 animate-spin" /> Generating PDF... </> ) 
                                : ( <> <Download className="w-5 h-5" /> Download Package </> )}
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

      </div> {/* End of screen display wrapper */}
    </div>
  );
};

export default ResultsDisplay;