import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const w = innerWidth;
const h = innerHeight;
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(w, h);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(2, 2, 5);

const scene = new THREE.Scene();
const gui = new dat.GUI();
const axes = new THREE.AxesHelper(1);
//scene.add(axes);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 1, 5);
scene.add(light);

const controls = new OrbitControls(camera, canvas);

// -----------------------

// Load textures
const disMap = new THREE.TextureLoader().load("canyon.png");
const norMap = new THREE.TextureLoader().load('canyon-normal.png');

// Flat plane geometry
const geo = new THREE.PlaneGeometry(5, 5, 1024, 1024);

// Material with vertex colors
const mat = new THREE.MeshStandardMaterial({
    displacementMap: disMap,
    displacementScale: 1.5,
    normalMap: norMap,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide,
    vertexColors: true
});

const plane = new THREE.Mesh(geo, mat);
plane.rotateX(-Math.PI / 2);
plane.position.y = 0;
scene.add(plane);

// Add vertex colors
const count = geo.attributes.position.count;
geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
const colors = geo.attributes.color;
const tempColor = new THREE.Color();

// Use heightmap image to assign vertex colors (without changing geometry)
const img = new Image();
img.src = 'canyon.png';
img.onload = () => {
    const canvas2 = document.createElement('canvas');
    canvas2.width = img.width;
    canvas2.height = img.height;
    const ctx = canvas2.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;

    for (let i = 0; i < count; i++) {
        const x = i % (geo.parameters.widthSegments + 1);
        const y = Math.floor(i / (geo.parameters.widthSegments + 1));

        const px = Math.floor(x / geo.parameters.widthSegments * (img.width - 1));
        const py = Math.floor(y / geo.parameters.heightSegments * (img.height - 1));
        const idx = (py * img.width + px) * 4;

        const h = data[idx] / 255; // grayscale value from 0 to 1

        // Map height to color
        if (h < 0.1) tempColor.set('#163280');      // Water
        //else if (h < 0.3) tempColor.set('#2a8f3f'); // Grass
        else if (h < 0.9) tempColor.set('#7b5e42'); // Rock
        else tempColor.set('#ffffff');              // Snow

        colors.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
    }
    colors.needsUpdate = true;
}

// -----------------------

function animate(time){
    time = time / 1000;
    //plane.rotation.z = time * 0.1;
    renderer.render(scene, camera);
    controls.update();
}
renderer.setAnimationLoop(animate);