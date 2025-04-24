/**
 * 3D Effects for Modern UI website
 * Utilizes Three.js for 3D animations and effects
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('3D effects module loaded');
});

/**
 * Initialize the 3D scene for the hero section
 * @param {string} containerId - ID of the container element
 */
function initHero3DScene(containerId) {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js is not loaded. 3D effects will not be displayed.');
        return;
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);
    
    // Create floating 3D objects
    createFloatingObjects(group);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Mouse movement for interactive effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update camera position based on mouse movement
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        group.rotation.y += 0.005 * (targetX - group.rotation.y);
        group.rotation.x += 0.005 * (targetY - group.rotation.x);
        
        // Animate individual objects
        group.children.forEach((object, i) => {
            object.rotation.x += 0.01;
            object.rotation.y += 0.01;
            
            // Subtle floating effect
            object.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

/**
 * Create floating 3D objects for the scene
 * @param {THREE.Group} group - The group to add objects to
 */
function createFloatingObjects(group) {
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x6a5acd, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xff6b6b, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0x36d1dc, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xffc93c, flatShading: true })
    ];
    
    // Add various geometric shapes
    for (let i = 0; i < 15; i++) {
        let geometry;
        
        // Create different geometries
        switch (i % 5) {
            case 0:
                geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.2, 0);
                break;
            case 1:
                geometry = new THREE.TetrahedronGeometry(Math.random() * 0.5 + 0.2, 0);
                break;
            case 2:
                geometry = new THREE.OctahedronGeometry(Math.random() * 0.5 + 0.2, 0);
                break;
            case 3:
                geometry = new THREE.DodecahedronGeometry(Math.random() * 0.5 + 0.2, 0);
                break;
            case 4:
                geometry = new THREE.TorusGeometry(Math.random() * 0.3 + 0.2, 0.1, 16, 100);
                break;
        }
        
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position randomly in a spherical arrangement
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.random() * 3 + 2;
        
        mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
        mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
        mesh.position.z = radius * Math.cos(phi);
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        // Add to group
        group.add(mesh);
    }
}

/**
 * Initialize the 3D scene for the About page
 * @param {string} containerId - ID of the container element
 */
function initAbout3DScene(containerId) {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js is not loaded. 3D effects will not be displayed.');
        return;
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a glowing sphere in the center
    const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x6a5acd,
        emissive: 0x6a5acd,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // Create particles around the sphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x6a5acd);
    const color2 = new THREE.Color(0x36d1dc);
    
    for (let i = 0; i < particleCount; i++) {
        // Position
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.random() * 2 + 2;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
        positions[i * 3 + 2] = radius * Math.cos(phi);                   // z
        
        // Color
        const mixRatio = Math.random();
        const mixedColor = new THREE.Color().lerpColors(color1, color2, mixRatio);
        
        colors[i * 3] = mixedColor.r;     // r
        colors[i * 3 + 1] = mixedColor.g; // g
        colors[i * 3 + 2] = mixedColor.b; // b
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the sphere
        sphere.rotation.y += 0.005;
        
        // Rotate the particles
        particles.rotation.y -= 0.002;
        
        // Pulsate the sphere
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        sphere.scale.set(scale, scale, scale);
        
        renderer.render(scene, camera);
    }
    
    animate();
}
