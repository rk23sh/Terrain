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
camera.position.set(2, 2, 5);

const scene = new THREE.Scene();
const gui = new dat.GUI();
const axes = new THREE.AxesHelper(1);
//scene.add(axes);

const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

const controls = new OrbitControls(camera, canvas);

// -------------


let disMap = new THREE.TextureLoader().load("everest.png");

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
        5, 5, 128, 128
    ),
    new THREE.MeshStandardMaterial({
        color: 0x008800,
        side: THREE.DoubleSide,
        wireframe: true,
        displacementMap: disMap
    })
);
plane.rotateX( -Math.PI / 2);
plane.position.y = -0.5;
scene.add(plane);

// this is lowest level
function animate(time){
    time = time / 1000;
    //plane.rotation.z = time * 0.5;
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);