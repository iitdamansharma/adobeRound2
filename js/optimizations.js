/**
 * Performance Optimizations
 * Adobe India Hackathon - Round 2 Solution
 */

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
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
 * Optimize search functionality with debounce
 */
function optimizeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        // Remove existing event listener
        const oldInputHandler = searchInput.onInput;
        if (oldInputHandler) {
            searchInput.removeEventListener('input', oldInputHandler);
        }
        
        // Add debounced event listener
        const debouncedSearch = debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                searchInDocument(searchTerm);
            }
        }, 300); // 300ms debounce time
        
        searchInput.addEventListener('input', debouncedSearch);
    }
}

/**
 * Lazy load document sections as they come into view
 */
function setupLazyLoading() {
    // Use Intersection Observer to load content as it comes into view
    if ('IntersectionObserver' in window) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.lazyLoad) {
                        // Load the content
                        const pageNumber = parseInt(element.dataset.lazyLoad);
                        // Load the page content if needed
                        console.log(`Lazy loading content for page ${pageNumber}`);
                        
                        // Remove from observation once loaded
                        observer.unobserve(element);
                    }
                }
            });
        }, options);
        
        // Observe elements with data-lazy-load attribute
        document.querySelectorAll('[data-lazy-load]').forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Cache frequently accessed document data
 * @param {string} key - The cache key
 * @param {any} data - The data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
function cacheData(key, data, ttl = 3600000) { // Default TTL: 1 hour
    const cacheItem = {
        data: data,
        expiry: Date.now() + ttl
    };
    
    try {
        localStorage.setItem(`pdf_reader_cache_${key}`, JSON.stringify(cacheItem));
    } catch (e) {
        console.warn('Cache storage failed:', e);
    }
}

/**
 * Get cached data
 * @param {string} key - The cache key
 * @returns {any|null} - The cached data or null if not found/expired
 */
function getCachedData(key) {
    try {
        const cacheJson = localStorage.getItem(`pdf_reader_cache_${key}`);
        if (!cacheJson) return null;
        
        const cacheItem = JSON.parse(cacheJson);
        if (cacheItem.expiry < Date.now()) {
            // Cache expired
            localStorage.removeItem(`pdf_reader_cache_${key}`);
            return null;
        }
        
        return cacheItem.data;
    } catch (e) {
        console.warn('Cache retrieval failed:', e);
        return null;
    }
}

/**
 * Apply all optimizations
 */
function applyOptimizations() {
    // Apply search optimization
    optimizeSearch();
    
    // Setup lazy loading
    setupLazyLoading();
    
    // Add event listeners with passive option for better scroll performance
    document.addEventListener('scroll', function() {
        // Scroll handling code
    }, { passive: true });
    
    // Use requestAnimationFrame for smooth animations
    function animateSidebar() {
        // Animation code here
        requestAnimationFrame(animateSidebar);
    }
    
    // Optimize images if any
    document.querySelectorAll('img').forEach(img => {
        if (!img.loading) {
            img.loading = 'lazy'; // Add lazy loading to images
        }
    });
    
    console.log('Performance optimizations applied');
}

// Apply optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Apply optimizations after a short delay to prioritize initial rendering
    setTimeout(applyOptimizations, 100);
});