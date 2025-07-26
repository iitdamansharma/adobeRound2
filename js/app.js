
// Global variables
let adobeDCView = null;
let currentPdf = null;
let clientId = "15f5e419780b46c8b1ec9aab9a3c7059"; 
 // Replace with your Adobe PDF Embed API client ID

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Adobe PDF Embed API
    document.addEventListener("adobe_dc_view_sdk.ready", initializeAdobeDC);
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Initialize Adobe DC View
 */
function initializeAdobeDC() {
    // Initialize the AdobeDC View object
    adobeDCView = new AdobeDC.View({
        clientId: clientId,
        divId: "adobe-dc-view"
    });
    
    // Register callback for save API
    registerSaveCallback();
    
    // Register callback for user profile API
    registerUserProfileCallback();
    
    console.log("Adobe DC View initialized");
}

/**
 * Set up event listeners for UI elements
 */
function setupEventListeners() {
    // Upload button click event
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change event
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                loadPdfFromFile(file);
            } else {
                alert('Please select a valid PDF file.');
            }
        }
    });
    
    // Toggle sidebar button
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('outline-sidebar');
    
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        const icon = toggleSidebarBtn.querySelector('i');
        if (sidebar.classList.contains('open')) {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        } else {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            searchInDocument(searchTerm);
        });
    }
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab-content`).classList.add('active');
        });
    });
}

/**
 * Load PDF from a file object
 * @param {File} file - The PDF file to load
 */
function loadPdfFromFile(file) {
    // Show loading state
    document.getElementById('pdf-placeholder').style.display = 'none';
    
    // Create a FileReader to read the file
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const filePromise = Promise.resolve(arrayBuffer);
        
        // Preview the PDF file using Adobe DC View
        const previewFilePromise = adobeDCView.previewFile({
            content: { promise: filePromise },
            metaData: { fileName: file.name }
        }, {
            embedMode: "FULL_WINDOW",
            showDownloadPDF: true,
            showPrintPDF: true,
            showAnnotationTools: true,
            showBookmarks: true
        });
        
        // Store the current PDF
        currentPdf = file;
        
        // Extract and display the document outline
        previewFilePromise.then(adobeViewer => {
            // Process the PDF to extract outline
            extractDocumentOutline(file);
            
            // Set up analytics events
            setupPdfAnalyticsEvents(adobeViewer);
            
            // Initialize bookmarks functionality
            initBookmarks(file.name);
        });
    };
    
    reader.readAsArrayBuffer(file);
}

/**
 * Register callback for save API
 */
function registerSaveCallback() {
    if (!adobeDCView) return;
    
    const saveOptions = {
        autoSaveFrequency: 0,
        enableFocusPolling: false,
        showSaveButton: true
    };
    
    adobeDCView.registerCallback(
        AdobeDC.View.Enum.CallbackType.SAVE_API,
        function(metaData, content, options) {
            return new Promise((resolve, reject) => {
                // Save the PDF with annotations
                const blob = new Blob([content], { type: 'application/pdf' });
                const fileName = metaData.fileName || "annotated_document.pdf";
                
                // Create a download link
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = fileName;
                downloadLink.click();
                
                // Resolve the promise
                resolve({
                    code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                    data: {
                        metaData: metaData
                    }
                });
            });
        },
        saveOptions
    );
}

/**
 * Register callback for user profile API
 */
function registerUserProfileCallback() {
    if (!adobeDCView) return;
    
    adobeDCView.registerCallback(
        AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
        function() {
            return new Promise((resolve, reject) => {
                resolve({
                    code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                    data: {
                        userProfile: {
                            name: "Adobe Hackathon User",
                            firstName: "Adobe",
                            lastName: "User",
                            email: "user@example.com"
                        }
                    }
                });
            });
        },
        {}
    );
}

/**
 * Set up analytics events for PDF viewer
 * @param {Object} adobeViewer - The Adobe viewer instance
 */
function setupPdfAnalyticsEvents(adobeViewer) {
    // Get the analytics events
    adobeViewer.registerCallback(
        AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
        function(event) {
            console.log("PDF Event:", event);
            
            // Handle specific events
            switch(event.type) {
                case "DOCUMENT_OPEN":
                    console.log("Document opened");
                    break;
                case "PAGE_VIEW":
                    console.log("Page viewed:", event.data.pageNumber);
                    break;
                case "ANNOTATION_ADDED":
                    console.log("Annotation added");
                    break;
                case "ANNOTATION_UPDATED":
                    console.log("Annotation updated");
                    break;
                case "ANNOTATION_DELETED":
                    console.log("Annotation deleted");
                    break;
            }
        },
        { enablePDFAnalytics: true }
    );
}

/**
 * Search for text in the PDF document
 * @param {string} searchTerm - The text to search for
 */
function searchInDocument(searchTerm) {
    if (!adobeDCView || !searchTerm) return;
    
    // Clear previous search results if search term is empty
    if (searchTerm.trim() === '') {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '';
        }
        return;
    }
    
    // Use the Adobe DC View API to search in the document
    adobeDCView.getAPIs().then(apis => {
        // Enable search APIs
        apis.search(searchTerm)
            .then(searchObject => {
                console.log("Search initiated for:", searchTerm);
                
                // Register callback to get search results updates
                searchObject.onResultsUpdate(handleSearchResults)
                    .then(result => {
                        if (!result) {
                            console.error("Failed to register search results callback");
                        }
                    })
                    .catch(error => {
                        console.error("Error registering search results callback:", error);
                    });
            })
            .catch(error => {
                console.error("Error searching document:", error);
            });
    });
}

/**
 * Handle search results from the PDF
 * @param {Object} searchResult - The search result object
 */
function handleSearchResults(searchResult) {
    console.log("Search results:", searchResult);
    
    // Get or create search results container
    let searchResults = document.getElementById('search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'search-results';
        searchResults.className = 'search-results';
        
        // Add to sidebar content
        const sidebarContent = document.querySelector('.sidebar-content');
        if (sidebarContent) {
            sidebarContent.appendChild(searchResults);
        }
    }
    
    // Update search results display
    if (searchResult.totalResults > 0) {
        // Clear previous results
        searchResults.innerHTML = '';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'search-results-header';
        header.textContent = `Found ${searchResult.totalResults} results`;
        searchResults.appendChild(header);
        
        // Show current result
        if (searchResult.currentResult) {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item active';
            resultItem.textContent = `Page ${searchResult.currentResult.pageNumber} (Result ${searchResult.currentResult.index + 1} of ${searchResult.totalResults})`;
            resultItem.setAttribute('data-page', searchResult.currentResult.pageNumber);
            resultItem.addEventListener('click', function() {
                navigateToPage(searchResult.currentResult.pageNumber);
            });
            searchResults.appendChild(resultItem);
        }
        
        // Add navigation buttons if there are multiple results
        if (searchResult.totalResults > 1) {
            const navButtons = document.createElement('div');
            navButtons.className = 'search-nav-buttons';
            
            const prevButton = document.createElement('button');
            prevButton.className = 'btn search-nav-btn';
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', function() {
                adobeDCView.getAPIs().then(apis => {
                    apis.search(document.getElementById('search-input').value)
                        .then(searchObj => {
                            searchObj.previous();
                        });
                });
            });
            
            const nextButton = document.createElement('button');
            nextButton.className = 'btn search-nav-btn';
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', function() {
                adobeDCView.getAPIs().then(apis => {
                    apis.search(document.getElementById('search-input').value)
                        .then(searchObj => {
                            searchObj.next();
                        });
                });
            });
            
            navButtons.appendChild(prevButton);
            navButtons.appendChild(nextButton);
            searchResults.appendChild(navButtons);
        }
    } else if (searchResult.status === "COMPLETED" && searchResult.totalResults === 0) {
        searchResults.innerHTML = '<div class="no-results">No results found</div>';
    }
}