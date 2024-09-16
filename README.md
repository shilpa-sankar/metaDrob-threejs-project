# Three.js Capsule Movement Project

This project showcases a simple 3D scene built with **Three.js** where a capsule geometry moves around a ground plane using WASD controls. It includes basic lighting, direction indicators, and boundary constraints for the capsule's movement.

## Deployed Project
You can view the live version of this project on Vercel by visiting the following link:

[Live Demo on Vercel](https://your-vercel-app-link.vercel.app)

## Features
- **3D Scene**: Built using **Three.js** with a capsule geometry and a ground plane.
- **WASD Movement Controls**: 
  - `W` - Move forward
  - `A` - Move left
  - `S` - Move backward
  - `D` - Move right
- **Directional Indicator**: A red arrow shows the current direction of movement.
- **Boundaries**: The capsule is constrained within the ground plane.
- **Lighting**: Ambient light illuminates the scene.

## Running the Project Locally

### Prerequisites
- Node.js installed on your machine.
- A package manager like **npm** or **yarn**.

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
2. **navigate to project repository**
    cd threejs-capsule-movement
3. Install Dependencies:
    npm install
4. Start the Development Server: If using Vite or another development tool:
    npm run dev
5. Open in Browser: Once the server is running, open your browser and go to:
    http://http://localhost:5173

### Code Structure

src/main.js (or equivalent entry file)
This file is the main entry point of the application where the Three.js scene is initialized and rendered.

createThreeJSCube(container)
Scene Setup: Initializes a THREE.Scene and adds a camera, renderer, and lighting.

Geometry: Creates a capsule geometry with CapsuleGeometry and a ground plane with PlaneGeometry.

Movement Controls: WASD keys control the movement of the capsule, while boundaries are enforced within the ground plane.

ArrowHelper: A direction arrow is attached to the capsule to indicate the movement direction.

Animation Loop: The scene continuously renders using requestAnimationFrame.

public/index.html

Contains the HTML boilerplate where the canvas for the Three.js scene is rendered.

Other Notes
The capsule’s movement logic is handled within event listeners for the keydown and keyup events.
The camera is fixed in place to provide a clear view of the scene, and the capsule is kept at a constant height above the ground.

### Deployment
1. To deploy this project to Vercel:

    npm install -g vercel

2. Deploy to Vercel:

    vercel

### Link

   https://meta-drob-threejs-project.vercel.app/




