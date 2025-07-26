/**
 * Browser Compatibility Check
 * Adobe India Hackathon - Round 2 Solution
 */

/**
 * Check browser compatibility and apply polyfills if needed
 */
function checkBrowserCompatibility() {
    const compatibilityIssues = [];
    
    // Check for basic required features
    if (!window.FileReader) {
        compatibilityIssues.push('FileReader API is not supported. PDF upload functionality may not work.');
    }
    
    if (!window.Promise) {
        compatibilityIssues.push('Promise API is not supported. Adding Promise polyfill.');
        // Add Promise polyfill
        addScript('https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js');
    }
    
    if (!window.fetch) {
        compatibilityIssues.push('Fetch API is not supported. Adding Fetch polyfill.');
        // Add Fetch polyfill
        addScript('https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js');
    }
    
    // Check for Array methods
    if (!Array.prototype.forEach || !Array.prototype.map || !Array.prototype.filter) {
        compatibilityIssues.push('Modern Array methods are not fully supported. Adding Array polyfills.');
        // Add Array polyfills
        addScript('https://cdn.jsdelivr.net/npm/core-js-bundle@3.25.1/minified.js');
    }
    
    // Check for localStorage
    let localStorageAvailable = false;
    try {
        localStorageAvailable = 'localStorage' in window && window.localStorage !== null;
        // Test localStorage
        window.localStorage.setItem('test', 'test');
        window.localStorage.removeItem('test');
    } catch (e) {
        localStorageAvailable = false;
    }
    
    if (!localStorageAvailable) {
        compatibilityIssues.push('LocalStorage is not available. Bookmarking functionality may not work.');
    }
    
    // Check for IntersectionObserver (used for lazy loading)
    if (!('IntersectionObserver' in window)) {
        compatibilityIssues.push('IntersectionObserver is not supported. Adding polyfill for lazy loading.');
        // Add IntersectionObserver polyfill
        addScript('https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.js');
    }
    
    // Display compatibility issues if any
    if (compatibilityIssues.length > 0) {
        console.warn('Browser Compatibility Issues:', compatibilityIssues);
        
        // Show compatibility warning to user if there are critical issues
        const criticalIssues = compatibilityIssues.filter(issue => 
            issue.includes('may not work') || issue.includes('not supported')
        );
        
        if (criticalIssues.length > 0) {
            showCompatibilityWarning(criticalIssues);
        }
    } else {
        console.log('Browser compatibility check passed. All required features are supported.');
    }
    
    // Apply browser-specific fixes
    applyBrowserFixes();
}

/**
 * Add a script to the document
 * @param {string} src - The script source URL
 */
function addScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
}

/**
 * Show compatibility warning to the user
 * @param {Array} issues - List of compatibility issues
 */
function showCompatibilityWarning(issues) {
    // Create warning element
    const warningEl = document.createElement('div');
    warningEl.className = 'compatibility-warning';
    warningEl.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff3cd;
        color: #856404;
        padding: 10px 15px;
        border-top: 1px solid #ffeeba;
        z-index: 1000;
        font-size: 14px;
        text-align: center;
    `;
    
    // Create warning content
    warningEl.innerHTML = `
        <strong>Browser Compatibility Warning:</strong> 
        Some features may not work correctly in your browser. 
        For the best experience, please use the latest version of Chrome, Firefox, Edge, or Safari.
        <button id="dismiss-warning" style="margin-left: 15px; padding: 3px 8px; cursor: pointer;">Dismiss</button>
    `;
    
    // Add to document
    document.body.appendChild(warningEl);
    
    // Add dismiss functionality
    document.getElementById('dismiss-warning').addEventListener('click', function() {
        warningEl.style.display = 'none';
    });
}

/**
 * Apply browser-specific fixes
 */
function applyBrowserFixes() {
    const ua = navigator.userAgent;
    
    // Safari-specific fixes
    if (ua.includes('Safari') && !ua.includes('Chrome')) {
        // Fix for Safari flexbox issues
        document.documentElement.classList.add('safari');
        
        // Apply Safari-specific CSS
        const safariStyles = document.createElement('style');
        safariStyles.textContent = `
            .safari .sidebar {
                display: flex !important;
                flex-direction: column !important;
            }
            .safari .sidebar-content {
                flex: 1 !important;
                height: auto !important;
                overflow-y: auto !important;
            }
        `;
        document.head.appendChild(safariStyles);
    }
    
    // IE/Edge legacy fixes
    if (ua.includes('Trident') || ua.includes('Edge/')) {
        document.documentElement.classList.add('ms-browser');
        
        // Apply IE/Edge-specific CSS
        const msStyles = document.createElement('style');
        msStyles.textContent = `
            .ms-browser .sidebar {
                display: block;
            }
            .ms-browser .sidebar-content {
                height: calc(100% - 50px);
                overflow-y: auto;
            }
        `;
        document.head.appendChild(msStyles);
    }
    
    // Mobile-specific adjustments
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        document.documentElement.classList.add('mobile-device');
        
        // Adjust viewport for better mobile experience
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        }
    }
}

// Run compatibility check when DOM is loaded
document.addEventListener('DOMContentLoaded', checkBrowserCompatibility);