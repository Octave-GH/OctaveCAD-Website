// Hotspot Interaction JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get all hotspots
    const hotspots = document.querySelectorAll('.hotspot');
    const modelContainer = document.querySelector('.model-container');
    const modelImage = modelContainer ? modelContainer.querySelector('img') : null;
    
    // If we have hotspots and a model, set up interactions
    if (hotspots.length > 0 && modelContainer && modelImage) {
        // Initialize hotspots
        setupHotspots();
        
        // Handle window resize
        window.addEventListener('resize', debounce(setupHotspots, 250));
        
        // Handle model zoom on click (optional feature)
        modelContainer.addEventListener('click', function(e) {
            // Only zoom if we didn't click on a hotspot
            if (!e.target.closest('.hotspot')) {
                modelContainer.classList.toggle('zoomed');
                
                if (modelContainer.classList.contains('zoomed')) {
                    // Add zoomed class to image
                    modelImage.style.transform = 'scale(1.5)';
                    
                    // Show all connection lines when zoomed
                    document.querySelectorAll('.connection').forEach(conn => {
                        conn.style.opacity = '0.5';
                    });
                } else {
                    // Remove zoom
                    modelImage.style.transform = 'scale(1)';
                    
                    // Hide all connection lines
                    document.querySelectorAll('.connection').forEach(conn => {
                        conn.style.opacity = '0';
                    });
                }
            }
        });
    }
    
    // Function to setup hotspots and their behaviors
    function setupHotspots() {
        hotspots.forEach(hotspot => {
            // Position info boxes based on viewport
            positionInfoBox(hotspot);
            
            // Add hover effects for both desktop and mobile
            setupHotspotInteraction(hotspot);
        });
    }
    
    // Function to position info boxes based on screen size
    function positionInfoBox(hotspot) {
        const infoBox = hotspot.querySelector('.info-box');
        const windowWidth = window.innerWidth;
        
        if (windowWidth <= 768) {
            // For mobile devices, position info boxes centrally
            infoBox.style.left = '50%';
            infoBox.style.transform = 'translateX(-50%)';
            infoBox.style.top = '40px';
        } else {
            // Use the CSS-defined positions for desktop
            infoBox.style.transform = '';
        }
    }
    
    // Setup interaction for each hotspot
    function setupHotspotInteraction(hotspot) {
        const dataInfo = hotspot.getAttribute('data-info');
        
        // Mouse enter effect
        hotspot.addEventListener('mouseenter', function() {
            // Highlight this hotspot
            hotspot.classList.add('active');
            
            // Show related connections
            highlightConnections(dataInfo);
            
            // Optional: add sound effect
            // playSound('hover');
        });
        
        // Mouse leave effect
        hotspot.addEventListener('mouseleave', function() {
            // Remove highlight
            hotspot.classList.remove('active');
            
            // Hide connections unless zoomed
            if (!modelContainer.classList.contains('zoomed')) {
                document.querySelectorAll('.connection').forEach(conn => {
                    conn.style.opacity = '0';
                });
            }
        });
        
        // Touch devices support
        hotspot.addEventListener('touchstart', function(e) {
            e.preventDefault();
            
            // Toggle active state
            const isActive = hotspot.classList.contains('active');
            
            // First, remove active class from all hotspots
            hotspots.forEach(h => h.classList.remove('active'));
            
            // Then, toggle this one if it wasn't already active
            if (!isActive) {
                hotspot.classList.add('active');
                highlightConnections(dataInfo);
            } else {
                // Hide connections
                document.querySelectorAll('.connection').forEach(conn => {
                    conn.style.opacity = '0';
                });
            }
        });
    }
    
    // Function to highlight connection lines related to a hotspot
    function highlightConnections(dataInfo) {
        // Hide all connections first
        document.querySelectorAll('.connection').forEach(conn => {
            conn.style.opacity = '0';
        });
        
        // Then show relevant connections
        if (dataInfo === 'bearing') {
            document.querySelector('.bearing-connector').style.opacity = '0.8';
            document.querySelector('.bearing-housing').style.opacity = '0.8';
        } else if (dataInfo === 'housing') {
            document.querySelector('.bearing-housing').style.opacity = '0.8';
            document.querySelector('.housing-motor').style.opacity = '0.8';
        } else if (dataInfo === 'motor') {
            document.querySelector('.housing-motor').style.opacity = '0.8';
            document.querySelector('.motor-connector').style.opacity = '0.8';
        } else if (dataInfo === 'connector') {
            document.querySelector('.bearing-connector').style.opacity = '0.8';
            document.querySelector('.motor-connector').style.opacity = '0.8';
        }
    }
    
    // Utility function to debounce window resize events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}); 