// src/threejs/threeCube.js
import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls'; // Make sure you include DragControls
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// const worldWidth = 128, worldDepth = 128;

export function createThreeJSCube(container) {

    // Scene
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Light setup
    const light = new THREE.AmbientLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Cuapsule
    const capsuleRadius = 0.5; // Radius of the hemispheres
    const capsuleHeight = 1; // Height of the cylindrical part
    const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x447194 });
    const capsule = new THREE.Mesh(geometry, material);
    capsule.position.set(-2, 0, 0);
    scene.add(capsule);

    // Ground Plane
    const planeSize = 100; // Size of the ground plane
    const halfPlaneSize = planeSize / 2; // Half the plane size for boundary calculations

    const planeGeometry = new THREE.PlaneGeometry(100, 100); // Large ground plane
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Simple gray plane
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    plane.position.y = -0.5; // Lower the plane a little so the cube sits on top
    scene.add(plane);

    // Set the capsule position on top of the plane
    const totalCapsuleHeight = capsuleHeight + 2 * capsuleRadius; // Total height of the capsule
    capsule.position.y = totalCapsuleHeight / 2; // Set the capsule so it's just above the plane

    // // Load 3D Model with GLTFLoader
    // const loader = new GLTFLoader();
    // let model;

    // loader.load(
    //     'http://localhost:5174/vibrant.glb', // Replace with the actual path to your 3D model file
    //     (gltf) => {
    //         model = gltf.scene;
    //         model.scale.set(1, 1, 1); // Adjust scale based on your model
    //         model.position.set(0, 0, 0); // Position on the ground plane
    //         model.traverse((child) => {
    //             if (child.isMesh) {
    //                 child.castShadow = true;
    //             }
    //         });
    //         scene.add(model);

    // ArrowHelper for direction indicator
    const direction = new THREE.Vector3(0, 0, 1); // Initial forward direction
    const arrowLength = 2; // Length of the arrow
    const arrowColor = 0xff0000; // Red color for the arrow
    const arrowHelper = new THREE.ArrowHelper(direction, capsule.position, arrowLength, arrowColor);
    scene.add(arrowHelper);


    // Initialize OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // Smoother movements
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2; // Prevent flipping below the ground

    // Initialize DragControls
    // const objects = [cube]; // Objects that can be dragged
    const dragControls = new DragControls([capsule], camera, renderer.domElement);

    dragControls.addEventListener('dragstart', function () {
        orbitControls.enabled = false;  // Disable OrbitControls during drag
    });

    dragControls.addEventListener('dragend', function () {
        orbitControls.enabled = true;   // Enable OrbitControls after drag ends
    });

    // Add event listener to restrict cube's movement within the plane
    dragControls.addEventListener('drag', function (event) {
        const object = event.object;

        // Restrict the cube's position within the boundaries of the plane
        object.position.x = Math.max(-halfPlaneSize, Math.min(halfPlaneSize, object.position.x));
        object.position.z = Math.max(-halfPlaneSize, Math.min(halfPlaneSize, object.position.z));

        // Keep the cube at a fixed height on the plane
        object.position.y = totalCapsuleHeight / 2; // Reset y position so it stays on top of the plane
        arrowHelper.position.copy(object.position); // Move the arrow along with the capsule
    });


  // WASD movement variables
  let moveForward = false;
  let moveBackward = false;
  let moveLeft = false;
  let moveRight = false;
  const moveSpeed = 0.1;

  // WASD Controls event listeners
  document.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyW':
        moveForward = true;
        break;
      case 'KeyA':
        moveLeft = true;
        break;
      case 'KeyS':
        moveBackward = true;
        break;
      case 'KeyD':
        moveRight = true;
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyW':
        moveForward = false;
        break;
      case 'KeyA':
        moveLeft = false;
        break;
      case 'KeyS':
        moveBackward = false;
        break;
      case 'KeyD':
        moveRight = false;
        break;
    }
  });
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    const directionVector = new THREE.Vector3();
    let rotationAngle = 0; // To keep track of the capsule's rotation angle

    // WASD movement logic
    if (moveForward) {
      capsule.position.z -= moveSpeed;
      directionVector.set(0, 0, -1); // Forward
      rotationAngle = 0; // No rotation needed for forward movement
    }
    if (moveBackward) {
      capsule.position.z += moveSpeed;
      directionVector.set(0, 0, 1); // Backward
      rotationAngle = Math.PI; // Rotate by 180 degrees for backward movement
    }
    if (moveLeft) {
      capsule.position.x -= moveSpeed;
      directionVector.set(-1, 0, 0); // Left
      rotationAngle = Math.PI / 2; // Rotate by 90 degrees for left movement
    }
    if (moveRight) {
      capsule.position.x += moveSpeed;
      directionVector.set(1, 0, 0); // Right
      rotationAngle = -Math.PI / 2; // Rotate by -90 degrees for right movement
    }

      // Restrict capsule within the boundaries of the plane
      capsule.position.x = Math.max(-halfPlaneSize, Math.min(halfPlaneSize, capsule.position.x));
      capsule.position.z = Math.max(-halfPlaneSize, Math.min(halfPlaneSize, capsule.position.z));

      // Keep the capsule at the correct height on the plane
      capsule.position.y = totalCapsuleHeight / 2;

      // Update the direction arrow based on capsule movement
      if (moveForward || moveBackward || moveLeft || moveRight) {
          directionVector.set(moveRight - moveLeft, 0, moveBackward - moveForward).normalize();
          arrowHelper.setDirection(directionVector); // Update arrow direction
      }

      // Keep the arrow at the capsule's position
      arrowHelper.position.copy(capsule.position);
    // orbitControls.update();
    renderer.render(scene, camera);

  };

  animate();
}
