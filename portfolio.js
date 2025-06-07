document.addEventListener('DOMContentLoaded', function() {
    // Select all navigation links
    const navLinks = document.querySelectorAll('nav a');
    // Select all sections of the page
    const sections = document.querySelectorAll('section');
    // Get the container for 3D floating shapes
    const floatingShapesContainer = document.getElementById('floating-shapes');

    // --- Smooth Scrolling for Navigation Links ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default jump behavior
            const targetId = this.getAttribute('href'); // Get the ID from the href (e.g., "#about")
            const targetSection = document.querySelector(targetId); // Find the corresponding section element

            if (targetSection) {
                // Calculate the scroll position, adjusting for the fixed header
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                // Smoothly scroll to the target position
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active class on nav links immediately
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // --- Highlight Active Navigation Link on Scroll ---
    // This function runs when the user scrolls the page
    function updateNavOnScroll() {
        const scrollY = window.scrollY; // Current vertical scroll position

        sections.forEach(section => {
            // Calculate section's top and height, accounting for fixed header
            const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id'); // Get the ID of the current section
            const correspondingLink = document.querySelector(nav [href="#${sectionId}"]); // Find the nav link for this section

            // Check if the current scroll position is within this section
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Remove 'active' class from all links first
                navLinks.forEach(link => link.classList.remove('active'));
                // Add 'active' class to the link corresponding to the current section
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Attach the scroll event listener
    window.addEventListener('scroll', updateNavOnScroll);
    // Call it once on page load to set the initial active link (e.g., if page loaded in middle)
    updateNavOnScroll();


    // --- Three.js for Floating Shapes in Hero Section ---
    // Check if Three.js library is loaded
    if (typeof THREE !== 'undefined' && floatingShapesContainer) {
        // 1. Scene: Where you place objects, lights, and cameras.
        const scene = new THREE.Scene();

        // 2. Camera: What the user sees. PerspectiveCamera mimics human vision.
        const camera = new THREE.PerspectiveCamera(
            75, // Field of view (degrees)
            floatingShapesContainer.clientWidth / floatingShapesContainer.clientHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );

        // 3. Renderer: Renders the scene from the camera's perspective onto a canvas.
        const renderer = new THREE.WebGLRenderer({
            alpha: true, // Makes the background transparent
            antialias: true // Smooths edges
        });

        // Set renderer size to match container and add to HTML
        renderer.setSize(floatingShapesContainer.clientWidth, floatingShapesContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // For sharp rendering on high-DPI screens
        floatingShapesContainer.appendChild(renderer.domElement); // Add the generated canvas to the HTML

        // Define different geometries (shapes) for the floating elements
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1), // Cube
            new THREE.TorusGeometry(0.5, 0.2, 16, 100), // Donut shape
            new THREE.DodecahedronGeometry(0.7), // 12-sided shape
            new THREE.SphereGeometry(0.7, 32, 32) // Sphere
        ];

        // Define different materials (colors/textures) for the shapes
        const materials = [
            new THREE.MeshBasicMaterial({ color: 0xc77dff, transparent: true, opacity: 0.6, wireframe: true }), // Purple wireframe
            new THREE.MeshBasicMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.5, wireframe: true }), // Pink wireframe
            new THREE.MeshBasicMaterial({ color: 0x4ecdc4, transparent: true, opacity: 0.4, wireframe: true }),  // Teal wireframe
            new THREE.MeshBasicMaterial({ color: 0xFFDA6B, transparent: true, opacity: 0.5, wireframe: true })  // Yellow wireframe
        ];

        const shapes = []; // Array to hold all created 3D shapes
        const numShapes = 15; // Number of floating shapes to create

        // Create and position the shapes
        for (let i = 0; i < numShapes; i++) {
            // Pick a random geometry and material
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const shape = new THREE.Mesh(geometry, material);

            // Set random initial positions within a certain range
            shape.position.x = (Math.random() - 0.5) * 10; // -5 to +5
            shape.position.y = (Math.random() - 0.5) * 10;
            shape.position.z = (Math.random() - 0.5) * 10;

            // Set random initial rotations
            shape.rotation.x = Math.random() * Math.PI;
            shape.rotation.y = Math.random() * Math.PI;

            scene.add(shape); // Add shape to the scene
            shapes.push(shape); // Store shape in the array
        }

        // Set camera's initial position
        camera.position.z = 5;

        // Animation Loop: This function is called repeatedly to update the scene
        function animate() {
            requestAnimationFrame(animate); // Request next frame for smooth animation

            shapes.forEach((shape, index) => {
                // Subtle rotation for each shape
                shape.rotation.x += 0.005 + (index * 0.0001);
                shape.rotation.y += 0.005 + (index * 0.0001);

                // Gentle floating movement using sine and cosine waves
                shape.position.y = Math.sin(Date.now() * 0.0005 + index) * 0.5;
                shape.position.x = Math.cos(Date.now() * 0.0007 + index) * 0.5;
            });

            renderer.render(scene, camera); // Render the updated scene
        }

        animate(); // Start the animation loop

        // Handle Window Resizing: Adjust camera aspect ratio and renderer size
        window.addEventListener('resize', () => {
            camera.aspect = floatingShapesContainer.clientWidth / floatingShapesContainer.clientHeight;
            camera.updateProjectionMatrix(); // Update camera's projection matrix
            renderer.setSize(floatingShapesContainer.clientWidth, floatingShapesContainer.clientHeight);
        });

        // Optional: Parallax effect based on mouse movement for extra depth
        document.addEventListener('mousemove', (event) => {
            // Normalize mouse coordinates to -1 to +1 range
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            // Adjust camera position slightly based on mouse
            camera.position.x = mouseX * 0.5; // Adjust sensitivity here (e.g., 0.5)
            camera.position.y = mouseY * 0.5;
            camera.lookAt(scene.position); // Make camera always look at the center of the scene
        });

    } else {
        console.warn("Three.js not loaded or #floating-shapes container not found. 3D effects will not be available.");
    }
    // --- End of Three.js Section ---
});