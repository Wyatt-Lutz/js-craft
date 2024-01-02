

class VoxelLoader {
    constructor(options) {
        this.chunkSize = options.chunkSize;
        this.tileSize = options.tileSize;
        this.tileTextureWidth = options.tileTextureWidth;
        this.tileTextureHeight = options.tileTextureHeight;

        this.chunk = new Map();
        this.positions = [];
        this.uvs = [];
        this.normals = [];
        this.indices = [];
    }
    /* input chunk position
       returns positions, normals, and indicies for voxel rendering
    */
    generateGeometryForChunk(chunkX, chunkY, chunkZ) {
        const { chunkSize, positions, normals, indices, uvs, tileSize, tileTextureHeight, tileTextureWidth } = this;
        positions.length = 0;
        normals.length = 0;
        indices.length = 0;
        uvs.length = 0;
     
        


        const startX = chunkX * chunkSize;
        const startY = chunkY * chunkSize;
        const startZ = chunkZ * chunkSize;
        //startY + chunkSize

        for (let voxelY = startY; voxelY < startY + chunkSize; voxelY++) {
            for (let voxelX = startX; voxelX < startX + chunkSize; voxelX++) {
                for (let voxelZ = startZ; voxelZ < startZ + chunkSize; voxelZ++) {
                    const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                    if (voxel) {
                        const uvVoxel = voxel - 1;
                        for (const { normal, vertices, uvRow } of VoxelLoader.faces) {
                            const neighbor = this.getVoxel(voxelX + normal[0], voxelY + normal[1], voxelZ + normal[2]);
                            if (neighbor !== 1) {
                                const index = positions.length / 3;
                                for (const {pos, uv} of vertices) {
                                    positions.push(pos[0] + voxelX - startX, pos[1] + voxelY - startY, pos[2] + voxelZ - startZ);
                                    normals.push(...normal);
                                  
                                    uvs.push((uvVoxel +   uv[0]) * tileSize / tileTextureWidth, 1 - (uvRow + 1 - uv[1]) * tileSize / tileTextureHeight);
                                }
                                indices.push(index, index + 1, index + 2, index + 2, index + 1, index + 3);
                                
                            }
                        }  

                    }

                }
            }
        }

    
        return {
            positions, normals, uvs, indices
        };


    }




    getChunkDataForVoxel(x, y, z) {
        const { chunkSize, chunk } = this;
        const chunkX = Math.floor(x / chunkSize);
        const chunkY = Math.floor(y / chunkSize);
        const chunkZ = Math.floor(z / chunkSize);
        const mapKey = `${chunkX}_${chunkY}_${chunkZ}`;
     

        if (!chunk.has(mapKey)) {
            chunk.set(mapKey, new Uint8Array(chunkSize ** 3)); 
        }

        return chunk.get(mapKey);

    }
    // returns voxelData from voxel position
    getVoxel(x, y, z) {
        const { chunk, voxelIndex } = this.getChunkAndVoxelIndex(x, y, z);
        return chunk[voxelIndex];
    }

    setVoxel(voxelPosX, voxelPosY, voxelPosZ) {
        const { chunk, voxelIndex } = this.getChunkAndVoxelIndex(voxelPosX, voxelPosY, voxelPosZ);
        chunk[voxelIndex] = 1;
    }

    getChunkAndVoxelIndex(x, y, z) {
        const chunk = this.getChunkDataForVoxel(x, y, z);
        const voxelIndex = this.calculateVoxelIndex(x, y, z);
        return { chunk, voxelIndex };
    }



    calculateVoxelIndex(x, y, z) {
        const { chunkSize } = this;
        const voxelX = x % chunkSize;
        const voxelY = y % chunkSize;
        const voxelZ = z % chunkSize;
        const voxelIndex = (voxelY * chunkSize * chunkSize) + (voxelZ * chunkSize) + voxelX;

        return voxelIndex;
    }

   

}

VoxelLoader.faces = [
    //left
    { 
        uvRow: 0, 
        normal: [ -1,  0,  0 ],
        vertices: [
            { pos: [ 0, 1, 0 ], uv: [ 0, 1 ], },
            { pos: [ 0, 0, 0 ], uv: [ 0, 0 ], },
            { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
            { pos: [ 0, 0, 1 ], uv: [ 1, 0 ], },
        ]
    },
    //right
    { 
        uvRow: 0, 
        normal: [ 1,  0,  0 ],
        vertices: [
            { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 1, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 1, 1 ], },
            { pos: [ 1, 0, 0 ], uv: [ 1, 0 ], },
        ]
    },
    //bottom
    { 
        uvRow: 1, 
        normal: [ 0, -1,  0 ],
        vertices: [
            { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
            { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 0, 0 ], uv: [ 1, 1 ], },
            { pos: [ 0, 0, 0 ], uv: [ 0, 1 ], },
        ]
    },
    //top
    { 
        uvRow: 2, 
        normal: [ 0,  1,  0 ],
        vertices: [
            { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
            { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 0, 1, 0 ], uv: [ 1, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 0, 0 ], },
        ]
    },
    //back
    { 
        uvRow: 0, 
        normal: [  0,  0, -1 ],
        vertices: [
            { pos: [ 1, 0, 0 ], uv: [ 0, 0 ], },
            { pos: [ 0, 0, 0 ], uv: [ 1, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 0, 1 ], },
            { pos: [ 0, 1, 0 ], uv: [ 1, 1 ], },
        ]
    },
    //front
    { 
        uvRow: 0, 
        normal: [ 0,  0,  1 ],
        vertices: [
        { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
        { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
        { pos: [ 0, 1, 1 ], uv: [ 0, 1 ], },
        { pos: [ 1, 1, 1 ], uv: [ 1, 1 ], },
        ]
    }
  ];

  export default VoxelLoader;