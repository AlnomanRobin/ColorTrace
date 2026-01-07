/**
 * Utility Functions for ColorTrace
 * Contains helper functions for color manipulation and conversion
 */

/**
 * Convert RGB to HEX color format
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} HEX color code
 */
function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert HEX to RGB color format
 * @param {string} hex - HEX color code
 * @returns {object} Object with r, g, b properties
 */
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle shorthand hex (e.g., #fff)
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

/**
 * Calculate relative luminance of a color
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Luminance value
 */
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if two colors are similar within a threshold
 * @param {object} color1 - First color {r, g, b}
 * @param {object} color2 - Second color {r, g, b}
 * @param {number} threshold - Similarity threshold (0-441.67)
 * @returns {boolean} True if colors are similar
 */
function areColorsSimilar(color1, color2, threshold = 30) {
    const distance = Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    );
    return distance < threshold;
}

/**
 * Validate HEX color format
 * @param {string} hex - HEX color code
 * @returns {boolean} True if valid HEX format
 */
function isValidHex(hex) {
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {number} duration - Display duration in milliseconds
 */
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * Show loading overlay
 */
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Get color name approximation (basic implementation)
 * @param {string} hex - HEX color code
 * @returns {string} Approximate color name
 */
function getColorName(hex) {
    const rgb = hexToRgb(hex);
    const { r, g, b } = rgb;
    
    // Basic color naming logic
    if (r > 200 && g < 100 && b < 100) return 'Red';
    if (r < 100 && g > 200 && b < 100) return 'Green';
    if (r < 100 && g < 100 && b > 200) return 'Blue';
    if (r > 200 && g > 200 && b < 100) return 'Yellow';
    if (r > 200 && g < 100 && b > 200) return 'Magenta';
    if (r < 100 && g > 200 && b > 200) return 'Cyan';
    if (r > 200 && g > 200 && b > 200) return 'White';
    if (r < 55 && g < 55 && b < 55) return 'Black';
    if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) return 'Gray';
    if (r > 150 && g > 100 && b < 100) return 'Orange';
    if (r > 100 && g < 100 && b > 150) return 'Purple';
    if (r > 150 && g > 150 && b > 100) return 'Beige';
    if (r < 100 && g > 100 && b > 100) return 'Teal';
    
    return 'Mixed';
}

/**
 * Sort colors by usage count
 * @param {Map} colorMap - Map of colors with usage counts
 * @returns {Array} Sorted array of color objects
 */
function sortColorsByUsage(colorMap) {
    return Array.from(colorMap.entries())
        .map(([hex, data]) => ({
            hex,
            rgb: data.rgb,
            count: data.count,
            percentage: 0 // Will be calculated later
        }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Generate random color
 * @returns {string} Random HEX color
 */
function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

/**
 * Check if color is light or dark
 * @param {string} hex - HEX color code
 * @returns {string} 'light' or 'dark'
 */
function getColorBrightness(hex) {
    const rgb = hexToRgb(hex);
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? 'light' : 'dark';
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Sanitize filename
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_\-\.]/gi, '_').toLowerCase();
}
