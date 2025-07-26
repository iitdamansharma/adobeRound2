# PDF Reader Application - Adobe India Hackathon Round 2

This application is a solution for Round 2 of the Adobe India Hackathon "Connecting the Dots" Challenge. It provides an intuitive web application for reading and interacting with PDF documents, leveraging Adobe's PDF Embed API.

## Features

- **PDF Viewing**: Seamlessly view PDF documents with Adobe's PDF Embed API
- **Document Structure Navigation**: Navigate through the document using the extracted outline
- **Annotations**: Add, edit, and save annotations to PDF documents
- **Responsive Design**: Works on desktop and mobile devices
- **User-friendly Interface**: Modern and intuitive UI for an enhanced reading experience

## Technologies Used

- HTML5, CSS3, JavaScript
- Adobe PDF Embed API
- Font Awesome for icons
- Integration with Round 1 solution for document structure extraction

## Setup Instructions

1. Clone this repository
2. Register for Adobe PDF Embed API credentials at [Adobe Developer Console](https://developer.adobe.com/console)
3. Replace `YOUR_CLIENT_ID` in `js/app.js` with your actual client ID
4. Open `index.html` in a web browser or host the files on a web server

## Project Structure

```
pdf-reader-app/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # CSS styles for the application
├── js/
│   ├── app.js          # Main application logic
│   └── outline.js      # Document outline functionality
└── assets/             # Images and other assets
```

## Integration with Round 1

This application integrates with the Round 1 solution to extract and display the document structure. The Round 1 solution extracts the document outline (title, headings) from the PDF, which is then used in this application to provide a navigable structure.

## How to Use

1. Open the application in a web browser
2. Click the "Upload PDF" button to select a PDF file
3. Once loaded, the PDF will be displayed in the viewer
4. Use the document outline in the sidebar to navigate through the document
5. Add annotations as needed and save the document

## Future Enhancements

- Advanced search functionality
- Document comparison features
- Collaborative annotation capabilities
- Integration with cloud storage services
- Enhanced accessibility features

## License

This project is licensed under the MIT License.

## Acknowledgements

- Adobe for providing the PDF Embed API
- The Adobe India Hackathon team for organizing the challenge