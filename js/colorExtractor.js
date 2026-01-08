/**
 * Color Extractor Module
 * Handles color extraction from various sources
 */

class ColorExtractor {
    constructor() {
        this.colorMap = new Map();
        this.similarityThreshold = 30;
    }

    /**
     * Extract colors from image file
     * @param {File} file - Image file
     * @returns {Promise<Array>} Array of color objects
     */
    async extractFromImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    try {
                        const colors = this.analyzeImage(img);
                        resolve(colors);
                    } catch (error) {
                        reject(error);
                    }
                };
                
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Analyze image and extract colors
     * @param {HTMLImageElement} img - Image element
     * @returns {Array} Array of color objects
     */
    analyzeImage(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size (sample for performance)
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
            height = (height / width) * maxSize;
            width = maxSize;
        } else if (height > maxSize) {
            width = (width / height) * maxSize;
            height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get pixel data
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        // Clear previous data
        this.colorMap.clear();
        
        // Sample pixels (every nth pixel for performance)
        const sampleRate = 5;
        for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Skip very dark or very light pixels (optional)
            const luminance = getLuminance(r, g, b);
            if (luminance < 0.05 || luminance > 0.95) continue;
            
            this.addColor(r, g, b);
        }
        
        // Convert to sorted array
        const colors = sortColorsByUsage(this.colorMap);
        
        // Calculate percentages
        const totalCount = colors.reduce((sum, c) => sum + c.count, 0);
        colors.forEach(color => {
            color.percentage = ((color.count / totalCount) * 100).toFixed(2);
        });
        
        // Return top colors
        return colors.slice(0, 50);
    }

    /**
     * Add color to map or increment count
     * @param {number} r - Red value
     * @param {number} g - Green value
     * @param {number} b - Blue value
     */
    addColor(r, g, b) {
        const hex = rgbToHex(r, g, b);
        const rgb = { r, g, b };
        
        // Check if similar color exists
        let found = false;
        for (const [existingHex, data] of this.colorMap) {
            if (areColorsSimilar(rgb, data.rgb, this.similarityThreshold)) {
                data.count++;
                found = true;
                break;
            }
        }
        
        // Add new color if not found
        if (!found) {
            this.colorMap.set(hex, { rgb, count: 1 });
        }
    }

    /**
     * Extract colors from PDF file
     * @param {File} file - PDF file
     * @returns {Promise<Array>} Array of color objects
     */
    async extractFromPDF(file) {
        // Note: Full PDF parsing requires external library like PDF.js
        // This is a simplified version that shows the concept
        showToast('PDF color extraction requires additional libraries. Showing sample colors.', 4000);
        
        // Return sample colors for demonstration
        return [
            { hex: '#000000', rgb: { r: 0, g: 0, b: 0 }, count: 100, percentage: '40.00' },
            { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, count: 80, percentage: '32.00' },
            { hex: '#333333', rgb: { r: 51, g: 51, b: 51 }, count: 50, percentage: '20.00' },
            { hex: '#0066CC', rgb: { r: 0, g: 102, b: 204 }, count: 20, percentage: '8.00' }
        ];
    }

    /**
     * Extract colors from document files (DOC, PPT, XLS)
     * @param {File} file - Document file
     * @returns {Promise<Array>} Array of color objects
     */
    async extractFromDocument(file) {
        // Note: Document parsing requires external libraries or backend processing
        showToast('Document color extraction requires server-side processing. Showing sample colors.', 4000);
        
        // Return sample colors for demonstration
        return [
            { hex: '#0078D4', rgb: { r: 0, g: 120, b: 212 }, count: 100, percentage: '35.00' },
            { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, count: 90, percentage: '31.50' },
            { hex: '#323130', rgb: { r: 50, g: 49, b: 48 }, count: 60, percentage: '21.00' },
            { hex: '#107C10', rgb: { r: 16, g: 124, b: 16 }, count: 35, percentage: '12.50' }
        ];
    }

    /**
     * Extract colors from current webpage
     * @returns {Array} Array of color objects
     */
    extractFromCurrentPage() {
        this.colorMap.clear();
        
        // Get all elements
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const styles = window.getComputedStyle(element);
            
            // Extract colors from various properties
            const properties = [
                'color',
                'backgroundColor',
                'borderColor',
                'borderTopColor',
                'borderRightColor',
                'borderBottomColor',
                'borderLeftColor',
                'outlineColor'
            ];
            
            properties.forEach(prop => {
                const value = styles[prop];
                if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') {
                    const rgb = this.parseColor(value);
                    if (rgb) {
                        this.addColor(rgb.r, rgb.g, rgb.b);
                    }
                }
            });
        });
        
        // Convert to sorted array
        const colors = sortColorsByUsage(this.colorMap);
        
        // Calculate percentages
        const totalCount = colors.reduce((sum, c) => sum + c.count, 0);
        colors.forEach(color => {
            color.percentage = ((color.count / totalCount) * 100).toFixed(2);
        });
        
        return colors.slice(0, 30);
    }

    /**
     * Extract colors from URL (with CORS limitations)
     * @param {string} url - Website URL
     * @returns {Promise<Array>} Array of color objects
     */
    async extractFromURL(url) {
        // Due to CORS restrictions, we can't directly fetch and parse external websites
        // This would require a backend proxy or browser extension
        showToast('Analyzing current page colors due to browser security restrictions.', 3000);
        return this.extractFromCurrentPage();
    }

    /**
     * Parse CSS color string to RGB
     * @param {string} colorString - CSS color string
     * @returns {object|null} RGB object or null
     */
    parseColor(colorString) {
        // Handle rgb/rgba format
        const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
            return {
                r: parseInt(rgbMatch[1]),
                g: parseInt(rgbMatch[2]),
                b: parseInt(rgbMatch[3])
            };
        }
        
        // Handle hex format
        if (colorString.startsWith('#')) {
            return hexToRgb(colorString);
        }
        
        // Handle named colors by creating temporary element
        const tempDiv = document.createElement('div');
        tempDiv.style.color = colorString;
        document.body.appendChild(tempDiv);
        const computed = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        
        return this.parseColor(computed);
    }

    /**
     * Extract colors from SVG file
     * @param {File} file - SVG file
     * @returns {Promise<Array>} Array of color objects
     */
    async extractFromSVG(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const svgText = e.target.result;
                    const colors = this.analyzeSVG(svgText);
                    resolve(colors);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read SVG file'));
            reader.readAsText(file);
        });
    }

    /**
     * Analyze SVG content for colors
     * @param {string} svgText - SVG file content
     * @returns {Array} Array of color objects
     */
    analyzeSVG(svgText) {
        this.colorMap.clear();
        
        // Parse SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        
        // Find all elements with color attributes
        const elements = svgDoc.querySelectorAll('*');
        
        elements.forEach(element => {
            // Check fill attribute
            const fill = element.getAttribute('fill');
            if (fill && fill !== 'none' && fill !== 'transparent') {
                const rgb = this.parseColor(fill);
                if (rgb) this.addColor(rgb.r, rgb.g, rgb.b);
            }
            
            // Check stroke attribute
            const stroke = element.getAttribute('stroke');
            if (stroke && stroke !== 'none' && stroke !== 'transparent') {
                const rgb = this.parseColor(stroke);
                if (rgb) this.addColor(rgb.r, rgb.g, rgb.b);
            }
            
            // Check style attribute
            const style = element.getAttribute('style');
            if (style) {
                const fillMatch = style.match(/fill:\s*([^;]+)/);
                const strokeMatch = style.match(/stroke:\s*([^;]+)/);
                
                if (fillMatch) {
                    const rgb = this.parseColor(fillMatch[1]);
                    if (rgb) this.addColor(rgb.r, rgb.g, rgb.b);
                }
                
                if (strokeMatch) {
                    const rgb = this.parseColor(strokeMatch[1]);
                    if (rgb) this.addColor(rgb.r, rgb.g, rgb.b);
                }
            }
        });
        
        // Convert to sorted array
        const colors = sortColorsByUsage(this.colorMap);
        
        // Calculate percentages
        const totalCount = colors.reduce((sum, c) => sum + c.count, 0);
        colors.forEach(color => {
            color.percentage = ((color.count / totalCount) * 100).toFixed(2);
        });
        
        return colors;
    }
}
