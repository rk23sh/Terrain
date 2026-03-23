import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const w = innerWidth;
const h = innerHeight;
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({
    antialias: true, 
    canvas
});
renderer.setSize(w, h);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(
    fov, aspect, near, far
);
camera.position.z = 5;

const scene = new THREE.Scene();
const gui = new dat.GUI();
const axes = new THREE.AxesHelper(2);
scene.add(axes);

// apply shaders: 
// apply shaders: 

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
    -1, 0, 0,   // left
     1, 0, 0,   // right
     0, 1.5, 0  // top
]);

const colors = new Float32Array([
    0, 0, 1,   // blue
    0, 1, 0,   // green
    1, 0, 0    // red
]);

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

async function main() {
    // 1. Wait for the files to actually download
    const vsResponse = await fetch("./vs.glsl");
    const fsResponse = await fetch("./fs.glsl");
    const vsText = await vsResponse.text();
    const fsText = await fsResponse.text();

    // 2. NOW create the material using that text
    const material = new THREE.ShaderMaterial({
        vertexShader: vsText,
        fragmentShader: fsText,
        vertexColors: true, // This tells Three.js to pass your 'color' attribute to the shader
    });

    const triangle = new THREE.Mesh(geometry, material);
    scene.add(triangle);
}

main();



// this is lowest level
function animate(time){
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);