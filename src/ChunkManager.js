
import VoxelLoader from './VoxelLoader.js';

import { Color, Mesh, BufferAttribute, WebGLRenderer, NearestFilter, MeshPhongMaterial, DoubleSide, SRGBColorSpace, Scene, PCFSoftShadowMap, PerspectiveCamera, BufferGeometry, MeshLambertMaterial, DirectionalLight, TextureLoader, RepeatWrapping, AmbientLight } from 'three';

const loader = new TextureLoader();
const texture = loader.load('../src/assets/textures/texatlas.png');
const cubeGeometry = new BufferGeometry();
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
texture.wrapS = RepeatWrapping;
texture.wrapT = RepeatWrapping;


const cubeMaterial = new MeshLambertMaterial({wireframe:false, map: texture, alphaTest: 0.1, transparent: true, side: DoubleSide});
class ChunkManager {
    constructor(chunkSize, tileSize, tileTextureHeight, tileTextureWidth, renderDistance, world) {
        this.chunkSize = chunkSize;
        this.tileSize = tileSize;
        this.tileTextureHeight = tileTextureHeight;
        this.tileTextureWidth = tileTextureWidth;
        this.renderDistance = renderDistance;
        this.world = world
        
        
        
    }

    generateChunk(chunkX, chunkY, chunkZ) {
        const { chunkSize, world} = this;
        const startY = chunkY * chunkSize;
        const startZ = chunkZ * chunkSize;
        const startX = chunkX * chunkSize;
    
        
        const { positions, normals, uvs, indices } = world.generateGeometryForChunk(chunkX, chunkY, chunkZ);
        
    
        
    
         
        cubeGeometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
        cubeGeometry.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
        cubeGeometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
        cubeGeometry.setIndex(indices);
    
      
    
    
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(startX, startY, startZ);
        Scene.DEFAULT_MATRIX_A

    }

    setVoxels(chunkX, chunkY, chunkZ) {
        const { chunkSize, world  } = this;
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

    generateChunks() {
        const { renderDistance, world } = this;
        for (let y = 0; y < 1; y++) {
            for (let z = 0; z < renderDistance; z++) {
                for (let x = 0; x < renderDistance; x++) {
                    this.setVoxels(x, y, z);
                   
    
                }
            }
        }
        for (let y = 0; y < 1; y++) {
            for (let z = 0; z < renderDistance; z++) {
                for (let x = 0; x < renderDistance; x++) {
               
                    this.generateChunk(x, y, z);
    
                }
            }
        }

    }




}



export default ChunkManager;