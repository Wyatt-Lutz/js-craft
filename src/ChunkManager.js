

import { Mesh, BufferAttribute, NearestFilter, DoubleSide, BufferGeometry, MeshLambertMaterial, TextureLoader, RepeatWrapping, SRGBColorSpace } from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
const loader = new TextureLoader();
const texture = loader.load('../src/assets/textures/texatlas.png');
const cubeGeometry = new BufferGeometry();
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;
//texture.wrapS = RepeatWrapping;
//texture.wrapT = RepeatWrapping;
texture.colorSpace = SRGBColorSpace;


const cubeMaterial = new MeshLambertMaterial({wireframe:false, map: texture, alphaTest: 0.1, transparent: true, side: DoubleSide});

class ChunkManager {
    params = {
        terrain: {
            scale: 90,
            magnitude: 0.5,
            offset: 0.5,
        }

    }

    constructor(chunkSize, tileSize, tileTextureHeight, tileTextureWidth, renderDistance, world, scene) {
        this.chunkSize = chunkSize
        this.tileSize = tileSize;
        this.tileTextureHeight = tileTextureHeight;
        this.tileTextureWidth = tileTextureWidth;
        this.renderDistance = renderDistance;
        this.world = world;
        this.scene = scene;
        
        
        
    }

    generateChunk(chunkX, chunkY, chunkZ) {
        const { chunkSize, world, scene } = this;
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
        scene.add(cube);
        

    }

    setVoxels(chunkX, chunkY, chunkZ) {
        const { chunkSize, world, params } = this;
        const startY = chunkY * chunkSize;
        const startZ = chunkZ * chunkSize;
        const startX = chunkX * chunkSize;
        const simplex = new SimplexNoise();

        for (let x = startX; x < startX + chunkSize; x++) {
            for (let z = startZ; z < startZ + chunkSize; z++) {
                const value = simplex.noise(
                    x / params.terrain.scale,
                    z / params.terrain.scale,
                );
                const scaledNoise = params.terrain.offset + params.terrain.magnitude * value;
                let height = 32 * scaledNoise;
                height = Math.max(5, Math.min(height, 100));

                for (let y = startY; y < startY + height; y++) {
                    world.setVoxel(x, y, z);
                }

            }
        }
        /*
        //startY + chunkSize
        for (let y = startY; y < 10; y++) {
            for (let z = startZ; z < startZ + chunkSize; z++) {
                for (let x = startX; x < startX + chunkSize; x++) {
                    world.setVoxel(x, y, z);
                }
            }
        }
        */

    }

    generateChunks() {
        const { renderDistance } = this;
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