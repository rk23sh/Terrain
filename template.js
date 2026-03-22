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
const axes = new THREE.AxesHelper(1);
scene.add(axes);







// this is lowest level
function animate(time){
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);