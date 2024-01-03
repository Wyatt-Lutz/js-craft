
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
camera.position.set( 94.28, 118.19, -33.37);
controls.update();
camera.lookAt( 30, 0, 30);

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

const chunkSize = 250;
const renderDistance = 1;
const tileSize = 106.643;
const tileTextureWidth = 106.643;
const tileTextureHeight = 320;

const world = new VoxelLoader({chunkSize, tileSize, tileTextureWidth, tileTextureHeight});


const chunkManager = new ChunkManager(chunkSize, tileSize, tileTextureHeight, tileTextureWidth, renderDistance, world, scene);


chunkManager.generateChunks();




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