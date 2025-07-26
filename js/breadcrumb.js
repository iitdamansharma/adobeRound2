/**
 * Breadcrumb Navigation Functionality
 * Adobe India Hackathon - Round 2 Solution
 */

/**
 * Update the breadcrumb navigation based on the current document section
 * @param {string} documentTitle - The title of the document
 * @param {Object} currentSection - The current section being viewed
 */
function updateBreadcrumb(documentTitle, currentSection) {
    const breadcrumbContainer = document.getElementById('document-breadcrumb');
    if (!breadcrumbContainer) return;
    
    // Clear existing breadcrumb
    breadcrumbContainer.innerHTML = '';
    
    // Add document title as first item
    const titleItem = document.createElement('li');
    titleItem.className = 'breadcrumb-item';
    const titleLink = document.createElement('a');
    titleLink.href = '#';
    titleLink.textContent = documentTitle;
    titleLink.addEventListener('click', function(e) {
        e.preventDefault();
        navigateToPage(1); // Navigate to first page
    });
    titleItem.appendChild(titleLink);
    breadcrumbContainer.appendChild(titleItem);
    
    // If no current section, we're done
    if (!currentSection) return;
    
    // Add current section to breadcrumb
    const sectionItem = document.createElement('li');
    sectionItem.className = 'breadcrumb-item active';
    sectionItem.textContent = currentSection.text;
    breadcrumbContainer.appendChild(sectionItem);
}

/**
 * Update breadcrumb based on current page
 * @param {number} pageNumber - The current page number
 * @param {Object} outlineData - The document outline data
 */
function updateBreadcrumbFromPage(pageNumber, outlineData) {
    if (!outlineData || !outlineData.outline || !outlineData.title) return;
    
    // Find the section that corresponds to the current page
    let currentSection = null;
    let previousSection = null;
    
    for (let i = 0; i < outlineData.outline.length; i++) {
        const section = outlineData.outline[i];
        
        if (section.page === pageNumber) {
            currentSection = section;
            break;
        } else if (section.page < pageNumber) {
            previousSection = section;
        } else if (section.page > pageNumber && previousSection) {
            // We've gone past the current page, use the previous section
            currentSection = previousSection;
            break;
        }
    }
    
    // If we didn't find a section, use the last section before this page
    if (!currentSection && previousSection) {
        currentSection = previousSection;
    }
    
    // Update the breadcrumb
    updateBreadcrumb(outlineData.title, currentSection);
}

/**
 * Initialize breadcrumb navigation
 * @param {Object} outlineData - The document outline data
 */
function initBreadcrumbNavigation(outlineData) {
    if (!outlineData || !outlineData.title) return;
    
    // Set initial breadcrumb
    updateBreadcrumb(outlineData.title);
    
    // Listen for page change events to update breadcrumb
    if (adobeDCView) {
        adobeDCView.registerCallback(
            AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            function(event) {
                if (event.type === "PAGE_VIEW") {
                    updateBreadcrumbFromPage(event.data.pageNumber, outlineData);
                }
            },
            { enablePDFAnalytics: true }
        );
    }
}