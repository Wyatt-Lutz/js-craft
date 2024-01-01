import * as THREE from 'three';

class VoxelLoader {
    constructor(chunkSize) {
        this.chunkSize = chunkSize;
        this.chunk = new Map();
    }
    /* input chunk position
       returns positions, normals, and indicies for voxel rendering
    */
    generateGeometryForChunk(chunkX, chunkY, chunkZ) {
        const { chunkSize } = this;
        const positions = [];
        const normals = [];
        const indices = [];

        const startX = chunkX * chunkSize;
        const startY = chunkY * chunkSize;
        const startZ = chunkZ * chunkSize;

        for (let y = 0; y < chunkSize; y++) {
            const voxelY = startY + y
            for (let x = 0; x < chunkSize; x++) {
                const voxelX = startX + x
                for (let z = 0; z < chunkSize; z++) {
                    const voxelZ = startZ + z;

                    for (const { vertices, normal } of VoxelLoader.faces) {
                        const neighbor = this.getVoxel(voxelX + normal[0], voxelY + normal[1], voxelZ + normal[2]);
                        if (neighbor !== 1) {
                            const index = positions.length / 3;
                            for (const position of vertices) {
                                positions.push(position[0] + x, position[1] + y, position[2] + z);
                                normals.push(...normal);
                            }
                            indices.push(index, index + 1, index + 2, index + 2, index + 1, index + 3);
                            
                        }
                    }   
                }
            }
        }

      
        return {
            positions, normals, indices
        };


    }




    getChunkDataForVoxel(x, y, z) {
        const { chunkSize } = this;
        const chunkX = Math.floor(x/this.chunkSize);
        const chunkY = Math.floor(y/this.chunkSize);
        const chunkZ = Math.floor(z/this.chunkSize);
        const mapKey = `${chunkX}_${chunkY}_${chunkZ}`;
     

        if (!this.chunk.has(mapKey)) {
            this.chunk.set(mapKey, new Uint8Array(chunkSize * chunkSize * chunkSize)); 
        }

        return this.chunk.get(mapKey);

    }
    // returns voxelData from voxel position
    getVoxel(x, y, z) {
        const chunk = this.getChunkDataForVoxel(x, y, z);
        const voxelIndex = this.calculateVoxelIndex(x, y, z);
        return chunk[voxelIndex];
    }

    setVoxel(voxelPosX, voxelPosY, voxelPosZ) {
        const chunk = this.getChunkDataForVoxel(voxelPosX, voxelPosY, voxelPosZ);
        const voxelIndex  = this.calculateVoxelIndex(voxelPosX, voxelPosY, voxelPosZ);
        chunk[voxelIndex] = 1;


    }



    calculateVoxelIndex(x, y, z) {
        const { chunkSize } = this;
        const voxelX = THREE.MathUtils.euclideanModulo(x, chunkSize) | 0;
        const voxelY = THREE.MathUtils.euclideanModulo(y, chunkSize) | 0;
        const voxelZ = THREE.MathUtils.euclideanModulo(z, chunkSize) | 0;
        const voxelIndex = (voxelY * chunkSize * chunkSize) + (voxelZ * chunkSize) + voxelX;

        return voxelIndex;
    }

   

}

VoxelLoader.faces = [
    // front
    { vertices: [
        [ 0, 0, 1 ],
        [ 1, 0, 1 ],
        [ 0, 1, 1 ],
        [ 1, 1, 1 ],
    ], normal: [ 0,  0,  1]}, 

    //right
    { vertices: [
        [ 1, 1, 1 ],
        [ 1, 0, 1 ],
        [ 1, 1, 0 ],
        [ 1, 0, 0 ],
    ], normal: [ 1,  0,  0]}, 

    //back
    { vertices: [
        [ 1, 0, 0 ],
        [ 0, 0, 0 ],
        [ 1, 1, 0 ],
        [ 0, 1, 0 ],
    ], normal: [  0,  0, -1]}, 

    //left
    { vertices: [
        [ 0, 1, 0 ],
        [ 0, 0, 0 ],
        [ 0, 1, 1 ],
        [ 0, 0, 1 ],
    ], normal: [ -1,  0,  0]}, 

    //top
    { vertices: [
        [ 0, 1, 1 ],
        [ 1, 1, 1 ],
        [ 0, 1, 0 ],
        [ 1, 1, 0 ],
    ], normal: [ 0,  1,  0]}, 

    //bottom
    { vertices: [
        [ 1, 0, 1 ],
        [ 0, 0, 1 ],
        [ 1, 0, 0 ],
        [ 0, 0, 0 ],
    ], normal: [ 0, -1,  0]}, 
  ];

  export default VoxelLoader;