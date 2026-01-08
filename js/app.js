/**
 * Main Application Logic for ColorTrace
 * Handles UI interactions and coordinates color extraction
 */

// Initialize color extractor
const colorExtractor = new ColorExtractor();

// Store current colors
let currentColors = [];

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const filePreview = document.getElementById('filePreview');
const clearFileBtn = document.getElementById('clearFile');
const urlInput = document.getElementById('urlInput');
const extractUrlBtn = document.getElementById('extractUrlBtn');
const eyedropperBtn = document.getElementById('eyedropperBtn');
const colorInputPicker = document.getElementById('colorInputPicker');
const manualColorInput = document.getElementById('manualColorInput');
const addManualColorBtn = document.getElementById('addManualColor');
const resultsSection = document.getElementById('resultsSection');
const colorGrid = document.getElementById('colorGrid');
const colorCount = document.getElementById('colorCount');
const exportColorsBtn = document.getElementById('exportColors');
const clearResultsBtn = document.getElementById('clearResults');

/**
 * Initialize application
 */
function init() {
    setupTabNavigation();
    setupFileUpload();
    setupURLExtraction();
    setupColorPicker();
    setupResultsActions();
}

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

/**
 * Setup file upload functionality
 */
function setupFileUpload() {
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Clear file button
    clearFileBtn.addEventListener('click', clearFile);
}

/**
 * Handle file selection
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

/**
 * Process uploaded file
 */
async function handleFile(file) {
    showLoading();
    
    try {
        // Show file preview
        displayFilePreview(file);
        
        // Extract colors based on file type
        let colors = [];
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        
        if (fileType.startsWith('image/')) {
            if (fileName.endsWith('.svg')) {
                colors = await colorExtractor.extractFromSVG(file);
            } else {
                colors = await colorExtractor.extractFromImage(file);
            }
        } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            colors = await colorExtractor.extractFromPDF(file);
        } else if (
            fileName.endsWith('.doc') ||
            fileName.endsWith('.docx') ||
            fileName.endsWith('.ppt') ||
            fileName.endsWith('.pptx') ||
            fileName.endsWith('.xls') ||
            fileName.endsWith('.xlsx')
        ) {
            colors = await colorExtractor.extractFromDocument(file);
        } else {
            throw new Error('Unsupported file type');
        }
        
        // Display results
        displayColors(colors);
        showToast(`Successfully extracted ${colors.length} colors from ${file.name}`);
        
    } catch (error) {
        console.error('Error processing file:', error);
        showToast('Error processing file: ' + error.message, 4000);
    } finally {
        hideLoading();
    }
}

/**
 * Display file preview
 */
function displayFilePreview(file) {
    uploadArea.style.display = 'none';
    fileInfo.style.display = 'block';
    
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            filePreview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <p><strong>${file.name}</strong> (${formatFileSize(file.size)})</p>
            `;
        };
        reader.readAsDataURL(file);
    } else {
        filePreview.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <p style="margin-top: 1rem;"><strong>${file.name}</strong></p>
                <p>${formatFileSize(file.size)}</p>
            </div>
        `;
    }
}

/**
 * Clear uploaded file
 */
function clearFile() {
    fileInput.value = '';
    uploadArea.style.display = 'flex';
    fileInfo.style.display = 'none';
    filePreview.innerHTML = '';
}

/**
 * Setup URL extraction
 */
function setupURLExtraction() {
    extractUrlBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        
        if (!url) {
            showToast('Please enter a URL', 3000);
            return;
        }
        
        showLoading();
        
        try {
            const colors = await colorExtractor.extractFromURL(url);
            displayColors(colors);
            showToast(`Extracted ${colors.length} colors from the page`);
        } catch (error) {
            console.error('Error extracting colors from URL:', error);
            showToast('Error extracting colors: ' + error.message, 4000);
        } finally {
            hideLoading();
        }
    });
    
    // Enter key support
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            extractUrlBtn.click();
        }
    });
}

/**
 * Setup color picker functionality
 */
function setupColorPicker() {
    // EyeDropper API (modern browsers)
    eyedropperBtn.addEventListener('click', async () => {
        if ('EyeDropper' in window) {
            try {
                const eyeDropper = new EyeDropper();
                const result = await eyeDropper.open();
                const hex = result.sRGBHex.toUpperCase();
                addSingleColor(hex);
                showToast(`Color picked: ${hex}`);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    showToast('Color picker cancelled or not supported', 3000);
                }
            }
        } else {
            showToast('EyeDropper API not supported in this browser. Use manual input below.', 4000);
        }
    });
    
    // Manual color input
    colorInputPicker.addEventListener('input', (e) => {
        manualColorInput.value = e.target.value.toUpperCase();
    });
    
    manualColorInput.addEventListener('input', (e) => {
        let value = e.target.value.trim();
        if (!value.startsWith('#')) {
            value = '#' + value;
        }
        if (isValidHex(value)) {
            colorInputPicker.value = value;
        }
    });
    
    addManualColorBtn.addEventListener('click', () => {
        let hex = manualColorInput.value.trim();
        if (!hex.startsWith('#')) {
            hex = '#' + hex;
        }
        
        if (isValidHex(hex)) {
            addSingleColor(hex.toUpperCase());
            showToast(`Color added: ${hex.toUpperCase()}`);
        } else {
            showToast('Invalid color format. Use #RRGGBB or #RGB', 3000);
        }
    });
}

/**
 * Add a single color to results
 */
function addSingleColor(hex) {
    const rgb = hexToRgb(hex);
    const color = {
        hex: hex.toUpperCase(),
        rgb: rgb,
        count: 1,
        percentage: '100.00'
    };
    
    // Check if color already exists
    const exists = currentColors.some(c => c.hex === color.hex);
    if (!exists) {
        currentColors.unshift(color);
        displayColors(currentColors);
    } else {
        showToast('Color already in the list', 2000);
    }
}

/**
 * Setup results section actions
 */
function setupResultsActions() {
    exportColorsBtn.addEventListener('click', exportColors);
    clearResultsBtn.addEventListener('click', clearResults);
}

/**
 * Display extracted colors
 */
function displayColors(colors) {
    currentColors = colors;
    
    if (colors.length === 0) {
        resultsSection.style.display = 'none';
        return;
    }
    
    resultsSection.style.display = 'block';
    colorCount.textContent = `${colors.length} color${colors.length !== 1 ? 's' : ''} found`;
    colorGrid.innerHTML = '';
    
    colors.forEach((color, index) => {
        const colorCard = createColorCard(color, index);
        colorGrid.appendChild(colorCard);
    });
}

/**
 * Create color card element
 */
function createColorCard(color, index) {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    const rgbString = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;
    
    card.innerHTML = `
        <div class="color-preview" style="background-color: ${color.hex};"></div>
        <div class="color-info">
            <div class="color-value">
                <span><span class="color-label">HEX:</span> ${color.hex}</span>
                <button class="copy-btn" data-color="${color.hex}" data-type="hex">Copy</button>
            </div>
            <div class="color-value">
                <span><span class="color-label">RGB:</span> ${rgbString}</span>
                <button class="copy-btn" data-color="rgb(${rgbString})" data-type="rgb">Copy</button>
            </div>
            ${color.percentage ? `<div class="color-usage">Usage: ${color.percentage}%</div>` : ''}
        </div>
    `;
    
    // Add copy functionality
    const copyButtons = card.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const colorValue = btn.getAttribute('data-color');
            const success = await copyToClipboard(colorValue);
            
            if (success) {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                showToast(`Copied: ${colorValue}`);
                
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);
            } else {
                showToast('Failed to copy to clipboard', 3000);
            }
        });
    });
    
    return card;
}

/**
 * Export colors to JSON file
 */
function exportColors() {
    if (currentColors.length === 0) {
        showToast('No colors to export', 2000);
        return;
    }
    
    const data = {
        exportDate: new Date().toISOString(),
        totalColors: currentColors.length,
        colors: currentColors.map(color => ({
            hex: color.hex,
            rgb: color.rgb,
            rgbString: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
            usage: color.percentage ? `${color.percentage}%` : 'N/A',
            name: getColorName(color.hex)
        }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colortrace-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Colors exported successfully!');
}

/**
 * Clear all results
 */
function clearResults() {
    currentColors = [];
    colorGrid.innerHTML = '';
    resultsSection.style.display = 'none';
    showToast('Results cleared');
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
