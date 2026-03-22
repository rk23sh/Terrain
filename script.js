import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(
    105,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 3;

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

scene.add(new THREE.AmbientLight(0x404040));

// geometry
const geometry = new THREE.SphereGeometry(1, 128, 128);
const pos = geometry.attributes.position;

// noise
const noise3D = createNoise3D();

// FBM function (multi-layer noise)
function fbm(x, y, z) {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;

    for (let i = 0; i < 5; i++) {
        total += noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }

    return total;
}

// colors
const colors = [];

// modify vertices
for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // normalize
    const length = Math.sqrt(x * x + y * y + z * z);
    let nx = x / length;
    let ny = y / length;
    let nz = z / length;

    // noise
    const n = fbm(nx * 3, ny * 3, nz * 3);

    const height = n * 0.2;

    // displace vertex
    pos.setXYZ(
        i,
        nx * (1 + height),
        ny * (1 + height),
        nz * (1 + height)
    );

    // biome coloring
    if (height < -0.05) {
        colors.push(0, 0, 0.5); // deep ocean
    } else if (height < 0) {
        colors.push(0, 0, 1); // water
    } else if (height < 0.02) {
        colors.push(0.9, 0.8, 0.6); // beach
    } else if (height < 0.1) {
        colors.push(0, 0.8, 0); // grass
    } else if (height < 0.2) {
        colors.push(0.5, 0.5, 0.5); // mountain
    } else {
        colors.push(1, 1, 1); // snow
    }
}

// apply colors
geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
);

// recompute normals (IMPORTANT)
geometry.computeVertexNormals();

// material
const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 1,
    metalness: 0
});

// mesh
const planet = new THREE.Mesh(geometry, material);
scene.add(planet);

// animation
function animate() {
    requestAnimationFrame(animate);

    planet.rotation.y += 0.002;

    renderer.render(scene, camera);
}

animate();

// resize handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});