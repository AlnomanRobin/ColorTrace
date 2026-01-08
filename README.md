# ColorTrace - Professional Color Identifier & Analyzer

A modern, responsive web application for identifying and extracting colors from various sources including images, documents, and websites.

## 🎨 Features

- **File Upload & Color Detection**: Extract colors from multiple file types (PNG, JPG, JPEG, SVG, PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX)
- **Website Color Extraction**: Analyze colors used in any webpage
- **Advanced Color Picker**: EyeDropper tool to pick colors from anywhere on screen
- **Color Management**: Display colors with HEX and RGB values, sorted by usage
- **Export Functionality**: Export extracted colors to JSON format
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 📁 Project Structure

```
ColorTrace/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling and responsive design
├── js/
│   ├── app.js          # Main application logic
│   ├── colorExtractor.js  # Color extraction module
│   └── utils.js        # Utility functions
├── assets/             # Assets folder (for future images/icons)
└── README.md           # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- No additional dependencies required

### Installation

1. Clone or download the project
2. Open `index.html` in your web browser
3. Start extracting colors!

### Usage

#### File Upload
1. Click on the upload area or drag & drop a file
2. Supported formats: Images (PNG, JPG, JPEG, SVG), Documents (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX)
3. View extracted colors sorted by usage

#### URL Extraction
1. Enter a website URL
2. Click "Extract Colors"
3. Note: Due to CORS restrictions, this feature analyzes the current page

#### Color Picker
1. Click "Pick Color" button
2. Use the eyedropper tool to select any color on screen
3. Or manually enter a HEX color code

## 🎯 Key Features Explained

### Color Detection Algorithm
- Samples pixels from uploaded images
- Groups similar colors to reduce noise
- Sorts colors by frequency of use
- Displays usage percentages

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly interface
- Optimized for all screen sizes

### Accessibility
- Keyboard navigation support
- Focus indicators
- ARIA labels where needed
- High contrast color choices

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling, Flexbox, Grid, Animations
- **JavaScript (ES6+)**: Modular code, async/await, modern APIs
- **Canvas API**: Image color extraction
- **EyeDropper API**: Screen color picking (Chrome 95+)
- **FileReader API**: File processing

## 🌐 Browser Support

- Chrome/Edge: Full support including EyeDropper API
- Firefox: Full support (manual color input for picker)
- Safari: Full support (manual color input for picker)

## 📝 Code Structure

### utils.js
Utility functions for:
- Color conversion (RGB ↔ HEX)
- Color similarity detection
- Validation functions
- Clipboard operations
- Toast notifications

### colorExtractor.js
Color extraction logic for:
- Image files (PNG, JPG, JPEG)
- SVG files
- PDF files (basic)
- Document files (basic)
- Web pages (DOM analysis)

### app.js
Main application logic:
- Tab navigation
- File upload handling
- UI interactions
- Results display
- Export functionality

## 🎨 Color Palette

The application uses a carefully selected color palette:
- Primary: `#3b82f6` (Blue)
- Secondary: `#6366f1` (Indigo)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Orange)

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Tablet: 768px - 481px
- Mobile: ≤ 480px

## 🔒 Security & Privacy

- All processing happens in the browser
- No data is sent to external servers
- Files are processed locally using Canvas API
- CORS-compliant for web scraping

## 🚧 Future Enhancements

- [ ] Backend server for full URL color extraction
- [ ] PDF.js integration for advanced PDF parsing
- [ ] Export to CSS/SCSS variables
- [ ] Color palette generation
- [ ] Color harmony suggestions
- [ ] Saved color collections
- [ ] Color accessibility checker

## 📄 License

This project is open source and available for personal and commercial use.

## 👨‍💻 Author

Built for designers and developers who need a professional color identification tool.

## 🙏 Acknowledgments

- Modern CSS design patterns
- Web APIs (Canvas, FileReader, EyeDropper)
- Color theory and algorithm implementations

---

**ColorTrace** - Making color identification simple and professional.
