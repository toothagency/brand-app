import jsPDF from "jspdf";
import type { DetailedBrandObject, BrandObjectColor } from "../../utils/types";

class ImprovedPdfBuilder {
  doc: jsPDF;
  currentY: number;
  pageHeight: number;
  pageWidth: number;
  leftMargin: number;
  rightMargin: number;
  contentWidth: number;
  lineHeightFactor: number;
  brandColors: { primary: string; secondary: string; accent: string };

  constructor(brandData?: DetailedBrandObject) {
    this.doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      putOnlyUsedFonts: true,
    });
    
    // Set up brand colors from data or use defaults
    this.brandColors = {
      primary: brandData?.brand_identity?.primary_colors?.[0]?.hex_value || "#7EC8E3",
      secondary: brandData?.brand_identity?.secondary_colors?.[0]?.hex_value || "#B8F2E6",
      accent: brandData?.brand_identity?.primary_colors?.[1]?.hex_value || "#FFF8B7"
    };

    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.leftMargin = 40;
    this.rightMargin = 40;
    this.currentY = 50;
    this.contentWidth = this.pageWidth - this.leftMargin - this.rightMargin;
    this.lineHeightFactor = 1.4;
  }

  private addPageIfNeeded(neededHeight: number) {
    if (this.currentY + neededHeight > this.pageHeight - 50) {
      this.addPage();
    }
  }

  private addPage() {
    this.doc.addPage();
    this.currentY = 50;
    this.addPageFooter();
  }

  private addPageFooter() {
    const pageNumber = this.doc.getNumberOfPages();
    this.doc.setFontSize(8);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(
      `Page ${pageNumber}`,
      this.pageWidth - this.rightMargin,
      this.pageHeight - 20,
      { align: "right" }
    );
  }

  private hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 126, g: 200, b: 227 }; // Default pastel blue
  }

  addCoverPage(title: string, brandName?: string, tagline?: string) {
    // Simple gradient background
    const primaryRgb = this.hexToRgb(this.brandColors.primary);
    const accentRgb = this.hexToRgb(this.brandColors.accent);
    
    // Create gradient effect with rectangles
    for (let i = 0; i < 20; i++) {
      const ratio = i / 20;
      const r = Math.round(primaryRgb.r + (accentRgb.r - primaryRgb.r) * ratio);
      const g = Math.round(primaryRgb.g + (accentRgb.g - primaryRgb.g) * ratio);
      const b = Math.round(primaryRgb.b + (accentRgb.b - primaryRgb.b) * ratio);
      
      this.doc.setFillColor(r, g, b);
      this.doc.rect(0, i * (this.pageHeight / 20), this.pageWidth, this.pageHeight / 20, "F");
    }
    
    // Main title
    this.doc.setFontSize(32);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(title, this.pageWidth / 2, 180, { align: "center" });
    
    // Decorative line
    this.doc.setDrawColor(255, 255, 255);
    this.doc.setLineWidth(2);
    this.doc.line(this.pageWidth / 2 - 80, 200, this.pageWidth / 2 + 80, 200);
    
    if (brandName) {
      this.doc.setFontSize(20);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(`For: ${brandName}`, this.pageWidth / 2, 240, { align: "center" });
    }
    
    if (tagline) {
      this.doc.setFontSize(12);
      this.doc.setFont("helvetica", "italic");
      this.doc.setTextColor(240, 240, 240);
      this.doc.text(`"${tagline}"`, this.pageWidth / 2, 280, { align: "center" });
    }
    
    // Add creation date
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(200, 200, 200);
    this.doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      this.pageWidth / 2,
      this.pageHeight - 80,
      { align: "center" }
    );
    
    this.addPage();
  }

  addSectionTitle(title: string, isMainSection: boolean = false) {
    this.addPageIfNeeded(50);
    
    if (isMainSection) {
      // Add colored background bar
      const primaryRgb = this.hexToRgb(this.brandColors.primary);
      this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      this.doc.rect(this.leftMargin - 10, this.currentY - 10, this.contentWidth + 20, 30, "F");
      
      this.doc.setFontSize(18);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(title, this.leftMargin, this.currentY + 8);
      this.currentY += 40;
    } else {
      this.doc.setFontSize(14);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(60, 60, 60);
      this.doc.text(title, this.leftMargin, this.currentY);
      
      // Add accent line
      const accentRgb = this.hexToRgb(this.brandColors.accent);
      this.doc.setDrawColor(accentRgb.r, accentRgb.g, accentRgb.b);
      this.doc.setLineWidth(2);
      this.doc.line(this.leftMargin, this.currentY + 5, this.leftMargin + 50, this.currentY + 5);
      
      this.currentY += 25;
    }
  }

  addKeyValuePair(label: string, value: string | string[] | undefined | null, isHighlight: boolean = false) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      value = "Not specified";
    }

    // Calculate needed height
    let neededHeight = 30;
    if (Array.isArray(value)) {
      neededHeight += value.length * 12;
    } else {
      const lines = this.doc.splitTextToSize(value, this.contentWidth - 10);
      neededHeight += lines.length * 10;
    }

    this.addPageIfNeeded(neededHeight);

    // Add background for highlighted items
    if (isHighlight) {
      this.doc.setFillColor(248, 250, 252);
      this.doc.rect(this.leftMargin - 5, this.currentY - 8, this.contentWidth + 10, neededHeight - 5, "F");
      
      // Add left border
      const primaryRgb = this.hexToRgb(this.brandColors.primary);
      this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      this.doc.rect(this.leftMargin - 5, this.currentY - 8, 3, neededHeight - 5, "F");
    }

    // Label
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(label.toUpperCase(), this.leftMargin, this.currentY);
    this.currentY += 12;

    // Value
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(50, 50, 50);

    if (Array.isArray(value)) {
      value.forEach((item) => {
        // Add bullet point
        this.doc.setFillColor(100, 100, 100);
        this.doc.circle(this.leftMargin + 3, this.currentY - 2, 1, "F");
        
        const lines = this.doc.splitTextToSize(item, this.contentWidth - 15);
        this.doc.text(lines, this.leftMargin + 10, this.currentY);
        this.currentY += lines.length * 10 + 2;
      });
    } else {
      const lines = this.doc.splitTextToSize(value, this.contentWidth - 5);
      this.doc.text(lines, this.leftMargin, this.currentY);
      this.currentY += lines.length * 10;
    }
    
    this.currentY += 10; // Spacing after value
  }

  // Special method for customer persona with 2-column layout
  addCustomerPersona(persona: any) {
    this.addSectionTitle(`Ideal Customer Persona: ${persona.name || "Target Customer"}`, true);
    
    // Calculate column width
    const columnWidth = (this.contentWidth - 20) / 2;
    const leftColumnX = this.leftMargin;
    const rightColumnX = this.leftMargin + columnWidth + 20;
    
    // Store starting Y position
    const startY = this.currentY;
    let leftColumnY = startY;
    let rightColumnY = startY;
    
    // Helper function to add content to a column
    const addToColumn = (title: string, content: string, isLeft: boolean) => {
      const x = isLeft ? leftColumnX : rightColumnX;
      let y = isLeft ? leftColumnY : rightColumnY;
      
      // Check if we need a new page
      if (y > this.pageHeight - 100) {
        this.addPage();
        y = this.currentY;
        if (isLeft) {
          leftColumnY = y;
          rightColumnY = startY; // Reset right column to start
        } else {
          rightColumnY = y;
        }
      }
      
      // Add section background
      const sectionHeight = this.calculateTextHeight(content, columnWidth - 10) + 25;
      this.doc.setFillColor(248, 250, 252);
      this.doc.rect(x - 5, y - 5, columnWidth + 10, sectionHeight, "F");
      
      // Add colored border
      const primaryRgb = this.hexToRgb(this.brandColors.primary);
      this.doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      this.doc.rect(x - 5, y - 5, 3, sectionHeight, "F");
      
      // Add title
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(60, 60, 60);
      this.doc.text(title.toUpperCase(), x, y + 8);
      
      // Add content
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(50, 50, 50);
      const lines = this.doc.splitTextToSize(content, columnWidth - 10);
      this.doc.text(lines, x, y + 20);
      
      // Update column Y position
      if (isLeft) {
        leftColumnY = y + sectionHeight + 15;
      } else {
        rightColumnY = y + sectionHeight + 15;
      }
    };
    
    // Add content to columns
    if (persona.demographics) {
      addToColumn("Demographics", persona.demographics, true);
    }
    
    if (persona.psychographics) {
      addToColumn("Psychographics", persona.psychographics, false);
    }
    
    if (persona.personality) {
      addToColumn("Personality", persona.personality, true);
    }
    
    if (persona.desires) {
      addToColumn("Desires", persona.desires, false);
    }
    
    if (persona.fears) {
      addToColumn("Fears", persona.fears, true);
    }
    
    if (persona.challenges_and_pain_points) {
      addToColumn("Challenges & Pain Points", persona.challenges_and_pain_points, false);
    }
    
    // Set currentY to the maximum of both columns
    this.currentY = Math.max(leftColumnY, rightColumnY) + 20;
  }

  private calculateTextHeight(text: string, width: number): number {
    const lines = this.doc.splitTextToSize(text, width);
    return lines.length * 10;
  }

  addColorPalette(colors: BrandObjectColor[], title: string) {
    this.addPageIfNeeded(80);
    
    this.addSectionTitle(title);
    
    colors.forEach((color, index) => {
      this.addPageIfNeeded(50);
      
      // Color swatch
      const colorRgb = this.hexToRgb(color.hex_value);
      this.doc.setFillColor(colorRgb.r, colorRgb.g, colorRgb.b);
      this.doc.rect(this.leftMargin, this.currentY, 30, 30, "F");
      
      // Border
      this.doc.setDrawColor(200, 200, 200);
      this.doc.setLineWidth(1);
      this.doc.rect(this.leftMargin, this.currentY, 30, 30, "S");

      // Color info
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(50, 50, 50);
      this.doc.text(color.color_name, this.leftMargin + 40, this.currentY + 10);
      
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(color.hex_value, this.leftMargin + 40, this.currentY + 22);
      
      // Description
      if (color.description) {
        this.doc.setFontSize(8);
        this.doc.setTextColor(80, 80, 80);
        const descLines = this.doc.splitTextToSize(color.description, this.contentWidth - 50);
        this.doc.text(descLines, this.leftMargin + 40, this.currentY + 32);
      }
      
      this.currentY += 45;
    });
  }

  addContentCalendarSample(entries: any[], maxEntries: number = 5) {
    this.addSectionTitle("Content Calendar Sample");
    
    if (entries.length === 0) {
      this.addKeyValuePair("Content Calendar", "No content calendar entries available");
      return;
    }
    
    // Add explanation
    this.doc.setFontSize(9);
    this.doc.setFont("helvetica", "italic");
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(
      `Showing ${Math.min(maxEntries, entries.length)} of ${entries.length} content calendar entries:`,
      this.leftMargin,
      this.currentY
    );
    this.currentY += 20;
    
    // Show sample entries
    entries.slice(0, maxEntries).forEach((entry, index) => {
      this.addPageIfNeeded(60);
      
      // Entry background
      this.doc.setFillColor(248, 250, 252);
      const entryHeight = 45;
      this.doc.rect(this.leftMargin - 5, this.currentY - 5, this.contentWidth + 10, entryHeight, "F");
      
      // Date and event
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(60, 60, 60);
      this.doc.text(`${entry.date} - ${entry.event}`, this.leftMargin, this.currentY + 8);
      
      // Caption
      if (entry.caption) {
        this.doc.setFontSize(8);
        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(80, 80, 80);
        const captionLines = this.doc.splitTextToSize(entry.caption, this.contentWidth - 10);
        this.doc.text(captionLines.slice(0, 2), this.leftMargin, this.currentY + 20); // Limit to 2 lines
        if (captionLines.length > 2) {
          this.doc.text("...", this.leftMargin + this.doc.getTextWidth(captionLines[1]), this.currentY + 30);
        }
      }
      
      this.currentY += entryHeight + 10;
    });
    
    if (entries.length > maxEntries) {
      this.doc.setFontSize(9);
      this.doc.setFont("helvetica", "italic");
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(
        `+ ${entries.length - maxEntries} more entries in your complete strategy...`,
        this.leftMargin,
        this.currentY + 10
      );
      this.currentY += 25;
    }
  }

  save(filename: string) {
    // Add final page footer to all pages
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      if (i > 1) { // Skip cover page
        this.addPageFooter();
      }
    }
    
    this.doc.save(filename);
  }
}

export default ImprovedPdfBuilder;