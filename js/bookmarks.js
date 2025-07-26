/**
 * Bookmarking Functionality
 * Adobe India Hackathon - Round 2 Solution
 */

// Store bookmarks in local storage
const BOOKMARKS_STORAGE_KEY = 'pdf_reader_bookmarks';

/**
 * Save a bookmark for the current document
 * @param {string} documentId - The document identifier (usually filename)
 * @param {number} pageNumber - The page number to bookmark
 * @param {string} title - The title for the bookmark
 * @param {string} note - Optional note for the bookmark
 */
function saveBookmark(documentId, pageNumber, title, note = '') {
    // Get existing bookmarks
    const bookmarks = getBookmarks();
    
    // Create document entry if it doesn't exist
    if (!bookmarks[documentId]) {
        bookmarks[documentId] = [];
    }
    
    // Add new bookmark
    const bookmark = {
        id: Date.now(), // Use timestamp as unique ID
        page: pageNumber,
        title: title,
        note: note,
        createdAt: new Date().toISOString()
    };
    
    bookmarks[documentId].push(bookmark);
    
    // Save to local storage
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    
    // Update UI
    displayBookmarks(documentId);
    
    return bookmark;
}

/**
 * Get all bookmarks from local storage
 * @returns {Object} - Object with document IDs as keys and arrays of bookmarks as values
 */
function getBookmarks() {
    const bookmarksJson = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : {};
}

/**
 * Get bookmarks for a specific document
 * @param {string} documentId - The document identifier
 * @returns {Array} - Array of bookmarks for the document
 */
function getDocumentBookmarks(documentId) {
    const bookmarks = getBookmarks();
    return bookmarks[documentId] || [];
}

/**
 * Delete a bookmark
 * @param {string} documentId - The document identifier
 * @param {number} bookmarkId - The bookmark ID to delete
 */
function deleteBookmark(documentId, bookmarkId) {
    const bookmarks = getBookmarks();
    
    if (bookmarks[documentId]) {
        bookmarks[documentId] = bookmarks[documentId].filter(b => b.id !== bookmarkId);
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
        
        // Update UI
        displayBookmarks(documentId);
    }
}

/**
 * Display bookmarks in the UI
 * @param {string} documentId - The document identifier
 */
function displayBookmarks(documentId) {
    const bookmarksContainer = document.getElementById('bookmarks-container');
    if (!bookmarksContainer) return;
    
    // Get bookmarks for this document
    const documentBookmarks = getDocumentBookmarks(documentId);
    
    // Clear container
    bookmarksContainer.innerHTML = '';
    
    // Add header
    const header = document.createElement('h3');
    header.className = 'bookmarks-header';
    header.textContent = 'Bookmarks';
    bookmarksContainer.appendChild(header);
    
    // If no bookmarks, show message
    if (documentBookmarks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'bookmarks-empty';
        emptyMessage.textContent = 'No bookmarks yet. Add bookmarks to quickly navigate to important sections.';
        bookmarksContainer.appendChild(emptyMessage);
        return;
    }
    
    // Create list of bookmarks
    const bookmarksList = document.createElement('ul');
    bookmarksList.className = 'bookmarks-list';
    
    documentBookmarks.forEach(bookmark => {
        const bookmarkItem = document.createElement('li');
        bookmarkItem.className = 'bookmark-item';
        
        // Create bookmark content
        const bookmarkContent = document.createElement('div');
        bookmarkContent.className = 'bookmark-content';
        
        const bookmarkTitle = document.createElement('div');
        bookmarkTitle.className = 'bookmark-title';
        bookmarkTitle.textContent = bookmark.title;
        
        const bookmarkPage = document.createElement('div');
        bookmarkPage.className = 'bookmark-page';
        bookmarkPage.textContent = `Page ${bookmark.page}`;
        
        bookmarkContent.appendChild(bookmarkTitle);
        bookmarkContent.appendChild(bookmarkPage);
        
        // Add note if exists
        if (bookmark.note) {
            const bookmarkNote = document.createElement('div');
            bookmarkNote.className = 'bookmark-note';
            bookmarkNote.textContent = bookmark.note;
            bookmarkContent.appendChild(bookmarkNote);
        }
        
        // Create bookmark actions
        const bookmarkActions = document.createElement('div');
        bookmarkActions.className = 'bookmark-actions';
        
        const goToButton = document.createElement('button');
        goToButton.className = 'btn bookmark-btn';
        goToButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
        goToButton.title = 'Go to bookmark';
        goToButton.addEventListener('click', function() {
            navigateToPage(bookmark.page);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn bookmark-btn delete-btn';
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.title = 'Delete bookmark';
        deleteButton.addEventListener('click', function() {
            deleteBookmark(documentId, bookmark.id);
        });
        
        bookmarkActions.appendChild(goToButton);
        bookmarkActions.appendChild(deleteButton);
        
        // Add content and actions to item
        bookmarkItem.appendChild(bookmarkContent);
        bookmarkItem.appendChild(bookmarkActions);
        
        // Add item to list
        bookmarksList.appendChild(bookmarkItem);
    });
    
    bookmarksContainer.appendChild(bookmarksList);
}

/**
 * Show dialog to add a new bookmark
 * @param {string} documentId - The document identifier
 * @param {number} currentPage - The current page number
 */
function showAddBookmarkDialog(documentId, currentPage) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal bookmark-modal';
    
    // Create modal content
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.innerHTML = '<h3>Add Bookmark</h3>';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    modalHeader.appendChild(closeButton);
    
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    // Create form
    const form = document.createElement('form');
    form.id = 'bookmark-form';
    
    // Title input
    const titleGroup = document.createElement('div');
    titleGroup.className = 'form-group';
    
    const titleLabel = document.createElement('label');
    titleLabel.htmlFor = 'bookmark-title';
    titleLabel.textContent = 'Title:';
    
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'bookmark-title';
    titleInput.className = 'form-control';
    titleInput.placeholder = 'Enter bookmark title';
    titleInput.required = true;
    
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);
    
    // Note input
    const noteGroup = document.createElement('div');
    noteGroup.className = 'form-group';
    
    const noteLabel = document.createElement('label');
    noteLabel.htmlFor = 'bookmark-note';
    noteLabel.textContent = 'Note (optional):';
    
    const noteInput = document.createElement('textarea');
    noteInput.id = 'bookmark-note';
    noteInput.className = 'form-control';
    noteInput.placeholder = 'Add a note to this bookmark';
    noteInput.rows = 3;
    
    noteGroup.appendChild(noteLabel);
    noteGroup.appendChild(noteInput);
    
    // Page info
    const pageInfo = document.createElement('div');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page: ${currentPage}`;
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn primary-btn';
    submitButton.textContent = 'Save Bookmark';
    
    // Add elements to form
    form.appendChild(titleGroup);
    form.appendChild(noteGroup);
    form.appendChild(pageInfo);
    form.appendChild(submitButton);
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const note = noteInput.value.trim();
        
        if (title) {
            saveBookmark(documentId, currentPage, title, note);
            document.body.removeChild(overlay);
        }
    });
    
    modalBody.appendChild(form);
    
    // Assemble modal
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    
    // Add modal to overlay
    overlay.appendChild(modal);
    
    // Add overlay to body
    document.body.appendChild(overlay);
    
    // Focus on title input
    titleInput.focus();
}

/**
 * Initialize bookmarking functionality
 * @param {string} documentId - The document identifier
 */
function initBookmarks(documentId) {
    // Display existing bookmarks
    displayBookmarks(documentId);
    
    // Add bookmark button event
    const addBookmarkBtn = document.getElementById('add-bookmark-btn');
    if (addBookmarkBtn) {
        addBookmarkBtn.addEventListener('click', function() {
            // Get current page
            if (adobeDCView) {
                adobeDCView.getAPIs().then(apis => {
                    apis.getCurrentPage()
                        .then(currentPage => {
                            showAddBookmarkDialog(documentId, currentPage);
                        })
                        .catch(error => {
                            console.error('Error getting current page:', error);
                            // Fallback to page 1
                            showAddBookmarkDialog(documentId, 1);
                        });
                });
            } else {
                // Fallback to page 1
                showAddBookmarkDialog(documentId, 1);
            }
        });
    }
}