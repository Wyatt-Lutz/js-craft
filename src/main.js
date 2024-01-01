import * as THREE from 'three';
import { Color, BoxGeometry, Scene, PlaneGeometry, MeshPhongMaterial, PerspectiveCamera, Mesh, MeshBasicMaterial, PointLightHelper, AxesHelper, PCFSoftShadowMap, WebGLRenderer, PointLight, DoubleSide, } from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import VoxelLoader from './VoxelLoader.js';
import Stats from 'stats.js'

//scene initialization
const scene = new Scene();
scene.background = new Color('#87ceeb');


//GLrenderer initialization
const renderer = new WebGLRenderer(
    {
        antialias: true,
    }
);
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );




//camera initialization
const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 ); // fov, aspect ratio, near, far
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 25, 100, 50 );
controls.update();
camera.lookAt( 0, 0, 0 );

window.addEventListener('resize', () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
 })



//light and shadow initialization

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 15, 15);
light.castShadow = true;
scene.add(light);
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);




const sideGrassTexture = new THREE.TextureLoader().load('../src/grass-side.png');
const topGrassTexture = new THREE.TextureLoader().load('../src/grass-top.png');
const chunkSize = 12;
const renderDistance = 35;

const world = new VoxelLoader(chunkSize);

function generateChunk(chunkX, chunkY, chunkZ) {
    const startY = chunkY * chunkSize;
    const startZ = chunkZ * chunkSize;
    const startX = chunkX * chunkSize;

    
    const { positions, normals, indices } = world.generateGeometryForChunk(chunkX, chunkY, chunkZ);
    const cubeGeometry = new THREE.BufferGeometry();
    const cubeMaterial = new THREE.MeshLambertMaterial({wireframe:true, color: 'green'});
     
    cubeGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    cubeGeometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    cubeGeometry.setIndex(indices);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(startX, startY, startZ);
    scene.add(cube);

}

function setVoxels(chunkX, chunkY, chunkZ) {
    const startY = chunkY * chunkSize;
    const startZ = chunkZ * chunkSize;
    const startX = chunkX * chunkSize;
    for (let y = startY; y < startY + chunkSize; y++) {
        for (let z = startZ; z < startZ + chunkSize; z++) {
            for (let x = startX; x < startX + chunkSize; x++) {
                world.setVoxel(x, y, z);
            }
        }
    }
}

function generateChunks() {
    for (let y = 0; y < 3; y++) {
        for (let z = 0; z < renderDistance; z++) {
            for (let x = 0; x < renderDistance; x++) {
                setVoxels(x, y, z);
               

            }
        }
    }
    for (let y = 0; y < 3; y++) {
        for (let z = 0; z < renderDistance; z++) {
            for (let x = 0; x < renderDistance; x++) {
           
                generateChunk(x, y, z);

            }
        }
    }
}

generateChunks();

















function animate() {
    //add something to update renderer size on screensize change
    stats.begin();
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.end();
}

//WebGL Compatibility Check
if ( WebGL.isWebGLAvailable() ) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}