
import * as THREE from 'three';
// import { DragControls } from 'three/examples/jsm/controls/DragControls'; 
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createThreeJSCube(container) {
  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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

  //setting the camera position fixed
  camera.position.set(0, 5, -10);
  camera.lookAt(capsule.position);

  // initialize capsule userdata for movement controls
  capsule.userData = {
    move: 'forward',
  }

  // Ground Plane
  const planeSize = 100; // Size of the ground plane
  const halfPlaneSize = planeSize / 2; // Half the plane size for boundary calculations

  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  plane.position.y = -0.5; // Lower the plane a little so the cube sits on top
  scene.add(plane);

  // Set the capsule position on top of the plane
  const totalCapsuleHeight = capsuleHeight + 2 * capsuleRadius; // Total height of the capsule
  capsule.position.y = totalCapsuleHeight / 2; // Set the capsule so it's just above the plane

  // easy to understand the direction of capsule
  const axesHelper = new THREE.AxesHelper(5);
  capsule.add(axesHelper);

  // ArrowHelper for direction indicator for movement controls
  const direction = new THREE.Vector3(0, 0, 1); // Initial forward direction
  const arrowLength = 2; // Length of the arrow
  const arrowColor = 0xff0000; // Red color for the arrow
  const arrowHelper = new THREE.ArrowHelper(direction, capsule.position, arrowLength, arrowColor);
  scene.add(arrowHelper);

  // initializing the driection vector for rotation of the capsule left & right
  const directionVector = new THREE.Vector3();

  const moveForwardFunc = () => {
    capsule.position.z -= moveSpeed;
    directionVector.set(0, 0, -1); // Forward
  }
  const moveBackwardFunc = () => {
    capsule.position.z += moveSpeed;
    directionVector.set(0, 0, 1); // Backward
  }
  const moveLeftFunc = () => {
    capsule.position.x -= moveSpeed;
    directionVector.set(-1, 0, 0); // left
  }
  const moveRightFunc = () => {
    capsule.position.x += moveSpeed;
    directionVector.set(1, 0, 0); // right
  }


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
        moveForwardFunc();
        break;
      case 'KeyA':
        moveLeft = true;
        moveLeftFunc();
        break;
      case 'KeyS':
        moveBackward = true;
        moveBackwardFunc();
        break;
      case 'KeyD':
        moveRight = true;
        moveRightFunc();
        break;
    }
    // Restrict capsule within the boundaries of the plane
    capsule.position.x = Math.max(-halfPlaneSize, Math.min(halfPlaneSize, capsule.position.x));
    capsule.position.z = Math.max(-halfPlaneSize, Math.min(halfPlaneSize, capsule.position.z));

    // Keep the capsule at the correct height on the plane
    capsule.position.y = totalCapsuleHeight / 2;

    // Update the direction based on capsule movement
    if (moveForward || moveBackward || moveLeft || moveRight) {
      directionVector.set(moveRight - moveLeft, 0, moveBackward - moveForward).normalize();
      arrowHelper.setDirection(directionVector); // Update arrow direction
    }
    if(moveLeft && capsule.userData.move !== 'left') {
      capsule.rotateY(-Math.PI / 2);
      capsule.userData.move = 'left';
    }
    if (moveRight && capsule.userData.move !== 'right') {
      capsule.rotateY(Math.PI / 2);
      capsule.userData.move = 'right'
    }
  });

  document.addEventListener('keyup', (event) => {
    if(moveLeft && capsule.userData.move === 'left') {
      capsule.rotateY(Math.PI /2);
      capsule.userData.move = 'forward'
    }
     if (moveRight && capsule.userData.move === 'right') {
      capsule.rotateY(-Math.PI / 2);
      capsule.userData.move = 'forward';
     }
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

    // Keep the arrow at the capsule's position
    arrowHelper.position.copy(capsule.position);
    renderer.render(scene, camera);

  };

  animate();
}
