
import { Color, Mesh, BufferAttribute, WebGLRenderer, NearestFilter, MeshPhongMaterial, DoubleSide, SRGBColorSpace, Scene, PCFSoftShadowMap, PerspectiveCamera, BufferGeometry, MeshLambertMaterial, DirectionalLight, TextureLoader, RepeatWrapping, AmbientLight } from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ChunkManager from './ChunkManager.js';
import Stats from 'stats.js';

import VoxelLoader from './VoxelLoader.js';

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
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );




//camera initialization
const camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 ); // fov, aspect ratio, near, far
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 4, 2, 5);
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

function lightInitialization() {
    const direcLight = new DirectionalLight(0xffffff);
    direcLight.position.set(100, 100, 100);
    direcLight.castShadow = true;
    scene.add(direcLight);

    const ambLight = new AmbientLight(0xffffff);
    ambLight.intensity = 0.1;
    scene.add(ambLight);

}
lightInitialization();


const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const chunkSize = 10;
const renderDistance = 1;
const tileSize = 106.643;
const tileTextureWidth = 106.643;
const tileTextureHeight = 320;

const world = new VoxelLoader({chunkSize, tileSize, tileTextureWidth, tileTextureHeight});


const chunkManager = new ChunkManager(chunkSize, tileSize, tileTextureHeight, tileTextureWidth, renderDistance, world);
const cube = chunkManager.generateChunks();




/*
const loader = new TextureLoader();


const texture = loader.load('../src/texatlas.png');
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;












function generateChunk(chunkX, chunkY, chunkZ) {


    const startY = chunkY * chunkSize;
    const startZ = chunkZ * chunkSize;
    const startX = chunkX * chunkSize;

    
    const { positions, normals, uvs, indices } = world.generateGeometryForChunk(chunkX, chunkY, chunkZ);
    const cubeGeometry = new BufferGeometry();

    const cubeMaterial = new MeshLambertMaterial({wireframe:false, map: texture, alphaTest: 0.1, transparent: true, side: DoubleSide});

     
    cubeGeometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    cubeGeometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    cubeGeometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    cubeGeometry.setIndex(indices);

  


    const cube = new Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(startX, startY, startZ);
    scene.add(cube);
    

}



function setVoxels(chunkX, chunkY, chunkZ) {
    const startY = chunkY * chunkSize;
    const startZ = chunkZ * chunkSize;
    const startX = chunkX * chunkSize;
    //startY + chunkSize
    for (let y = startY; y < 10; y++) {
        for (let z = startZ; z < startZ + chunkSize; z++) {
            for (let x = startX; x < startX + chunkSize; x++) {
                world.setVoxel(x, y, z);
            }
        }
    }
}

function generateChunks() {
    for (let y = 0; y < 1; y++) {
        for (let z = 0; z < renderDistance; z++) {
            for (let x = 0; x < renderDistance; x++) {
                setVoxels(x, y, z);
               

            }
        }
    }
    for (let y = 0; y < 1; y++) {
        for (let z = 0; z < renderDistance; z++) {
            for (let x = 0; x < renderDistance; x++) {
           
                generateChunk(x, y, z);

            }
        }
    }
}

generateChunks();


*/














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