// --- Sticky Header effect on Scroll Up: header is hidden, appears on scroll up ---
function stickyHeader() {
    // Gets site header
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        let lastScrollY = window.scrollY;
        // Get header height (the CSS variable value defined in th stylesheet)
        const headerHeight = siteHeader.offsetHeight;

        // Creates the listener on scroll
        window.addEventListener('scroll', () => {

            // Define vertical scroll position
            const currentScrollY = window.scrollY;

            if (currentScrollY <= headerHeight) {
                // Always show header when near the top by removing the hidden class when currentScrollY is smaller or equal to the header height  
                siteHeader.classList.remove('header-hidden');
            } else {
                if (currentScrollY > lastScrollY) {
                    // If scrolling down, add hidden class, hiding the header
                    siteHeader.classList.add('header-hidden');
                } else {
                    // If scrolling up, remove the hidden class, showing the header
                    siteHeader.classList.remove('header-hidden');
                }
            }
            // Update last scroll position, but not if it's bouncing around the top boundary
            if (Math.abs(currentScrollY - lastScrollY) > 5) { // Add a small threshold
                lastScrollY = currentScrollY;
            }
        });
    }
}

// --- Hamburger Menu Toggle ---
function hamburgerMenu() {

    // Get the hamburger button
    const hamburgerButton = document.getElementById('hamburger-toggle');
    // And the main nav...
    const mainNav = document.getElementById('main-nav');

    if (hamburgerButton && mainNav) {
        // Listener, on click, expand
        hamburgerButton.addEventListener('click', () => {
            // Get and set isExpanded
            const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true';

            // Toggle aria attribute for accessibility and open classes
            hamburgerButton.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('nav-open');

            // Toggle body scroll, no scroll when hamburger is expanded
            document.body.classList.toggle('no-scroll', !isExpanded);
        });

        // Close menu when clicking a link inside it, remove pertinent classes, etc
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('nav-open')) {
                    hamburgerButton.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('nav-open');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }
}

// --- FAB Sidebar Toggle ---
function sidebarButton() {
    // Get and set the FAB and the sidebar nav
    const fabSidebarButton = document.getElementById('fab-sidebar-toggle');
    const contextualSidebar = document.getElementById('contextual-sidebar');

    if (fabSidebarButton && contextualSidebar) {
        // Adds the listener
        fabSidebarButton.addEventListener('click', () => {
            // Get set isExpanded
            const isExpanded = fabSidebarButton.getAttribute('aria-expanded') === 'true';

            // Toggle aria and classes
            fabSidebarButton.setAttribute('aria-expanded', !isExpanded);
            contextualSidebar.classList.toggle('sidebar-open');
            contextualSidebar.classList.toggle('box-shadow');
            fabSidebarButton.classList.toggle('fab-active');
            fabSidebarButton.classList.remove('box-shadow');
        });

        // Close sidebar when a link inside it is clicked
        contextualSidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Only close if it's actually open (might be clicked on desktop too)
                if (contextualSidebar.classList.contains('sidebar-open')) {
                    fabSidebarButton.setAttribute('aria-expanded', 'false');
                    contextualSidebar.classList.remove('sidebar-open');
                    contextualSidebar.classList.remove('box-shadow');
                    fabSidebarButton.classList.remove('fab-active');
                    fabSidebarButton.classList.toggle('box-shadow');
                }
            });
        });
    }
}

// --- Accordion-related code --- 
function accordion() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        const controlledPanelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(controlledPanelId);

        // Return if no panel
        if (!panel) {
            return;
        }

        // Initialize panels based on aria-expanded state, which can be defined via HTML
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // If is expanded, add proper class, else ensure no class etc
        if (isExpanded) {
            panel.classList.add('is-open');

            // This is a small piece of trickery for accordions, courtesy of w3c schools. Bascially what it is doing is programatically setting max-height when panel is open, which will then allow us to animate the opening itself with CSS. The reason for this is because height: auto cannot be animated through CSS transitions...
            // https://www.w3schools.com/howto/howto_js_accordion.asp
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }

        } else {
            panel.classList.remove('is-open');
        }

        // Adds click listeners to the triggerrs
        trigger.addEventListener('click', function() {
            const currentExpanded = this.getAttribute('aria-expanded') === 'true';
            const newExpanded = !currentExpanded;
            this.setAttribute('aria-expanded', newExpanded);


            panel.classList.toggle('is-open', newExpanded);

            // Same max-height trick as before
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}

// --- Proccesses page hash (after cliclink a link) and checks to see if it's an accordion item, and if it is, open it automatically
function accordionOpen() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return; // No hash or empty hash

    const targetId = hash.substring(1); // Remove #
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
        // Return if no target
        return;
    }

    let triggerToActivate = null;

    // Target the trigger of the accordion item
    triggerToActivate = targetElement.querySelector('.accordion-trigger');


    // If it worked...
    if (triggerToActivate) {
        // Check if the accordion (controlled by this trigger) is currently closed
        if (triggerToActivate.getAttribute('aria-expanded') === 'false') {
            // Click the trigger to open it.
            triggerToActivate.click();
        }

        // Focus the trigger after ensuring it's open, so it's accessiblezzzz and practical for them kb users
        setTimeout(() => {
            triggerToActivate.focus({
                preventScroll: true
            }); // PreventScroll if browser already scrolled
        }, 50); // Small delay
    }
}

// --- Listeners so it calls the functions needed, only the hash one has to be called  every time the hash changes ---

// Process on initial load
document.addEventListener('DOMContentLoaded', () => {
    stickyHeader();
    hamburgerMenu();
    sidebarButton();
    accordion();
    accordionOpen();
});
// Process on hash changes
window.addEventListener('hashchange', accordionOpen);