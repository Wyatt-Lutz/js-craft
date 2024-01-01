
import { Color, Mesh, BufferAttribute, WebGLRenderer, NearestFilter, MeshPhongMaterial, DoubleSide, SRGBColorSpace, Scene, PCFSoftShadowMap, PerspectiveCamera, BufferGeometry, MeshLambertMaterial, DirectionalLight, TextureLoader, RepeatWrapping } from 'three';
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
renderer.shadowMap.type = PCFSoftShadowMap;
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

const light = new DirectionalLight(0xffffff);
light.position.set(0, 15, 15);
light.castShadow = true;
scene.add(light);
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


const loader = new TextureLoader();
const sideGrassTexture = loader.load('../src/grass-side.png');
sideGrassTexture.magFilter = NearestFilter;
sideGrassTexture.minFilter = NearestFilter;
//sideGrassTexture.colorSpace = SRGBColorSpace;
sideGrassTexture.wrapS = RepeatWrapping;
sideGrassTexture.wrapT = RepeatWrapping;

const topGrassTexture = loader.load('../src/grass-top.png');
topGrassTexture.magFilter = NearestFilter;
topGrassTexture.minFilter = NearestFilter;
//sideGrassTexture.colorSpace = SRGBColorSpace;
topGrassTexture.wrapS = RepeatWrapping;
topGrassTexture.wrapT = RepeatWrapping;




const chunkSize = 2;
const renderDistance = 1;
const tileSize = 16;
const tileTextureWidth = 256;
const tileTextureHeight = 64;

const world = new VoxelLoader({chunkSize, tileSize, tileTextureWidth, tileTextureHeight});

function generateChunk(chunkX, chunkY, chunkZ) {
    const startY = chunkY * chunkSize;
    const startZ = chunkZ * chunkSize;
    const startX = chunkX * chunkSize;

    
    const { positions, normals, uvs, indices } = world.generateGeometryForChunk(chunkX, chunkY, chunkZ);
    const cubeGeometry = new BufferGeometry();

    const cubeMaterial = new MeshLambertMaterial({wireframe:false, map: sideGrassTexture, alphaTest: 0.1, transparent: true, side: DoubleSide});

     
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
    for (let y = startY; y < startY + chunkSize; y++) {
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