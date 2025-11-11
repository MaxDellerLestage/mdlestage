import * as THREE from 'three';

/*
    These functions are used in /src/components/Water to populate data arrays for use in the FBO.
    The Water component uses an Icosahedron geometry as its base vertex position data.
*/

// Per vertex position, normal, index, and uv data is extracted from 
// three.js Icosahedron geometry for later use in the FBO
export function getTexturePosition(res: number){

    const sphere = new THREE.IcosahedronGeometry(1, res);
    const indexed = sphere;
    const positionAttribute = indexed.getAttribute('position');
    const uvAttribute = indexed.getAttribute("uv");
    const init_vertexCount = positionAttribute.count;

    const precision = 1e5;

    const vertexCount = Math.ceil(init_vertexCount/3)*3;
    const resolution = Math.ceil(Math.sqrt(vertexCount));
    const resolutionHeight = Math.ceil(vertexCount/resolution);
    const paddedLength = resolution * resolutionHeight * 4;

    const data = {
        flatPositions: new Float32Array(paddedLength),
        flatNormals: new Float32Array(paddedLength),
        count: vertexCount,
        resolution: resolution,
        resHeight: resolutionHeight,
        size: paddedLength,
        indexTex: new Float32Array(paddedLength),
        index: new Float32Array(vertexCount),
        groupIndex: new Float32Array(vertexCount),
        uvs: uvAttribute,
        vertexGroups: new Map() 
    };
    
    let groupCounter = 0;

    for (let i=0; i<vertexCount; i++) {

        data.flatPositions[i*4+0] = positionAttribute.array[i*3+0];
        data.flatPositions[i*4+1] = positionAttribute.array[i*3+1];
        data.flatPositions[i*4+2] = positionAttribute.array[i*3+2];
        data.flatPositions[i*4+3] = 1.0;

        const x = Math.round(positionAttribute.array[i*3+0] * precision);
        const y = Math.round(positionAttribute.array[i*3+1] * precision);
        const z = Math.round(positionAttribute.array[i*3+2] * precision);

        if (x || y || z) {
            const key = `${x}, ${y}, ${z}`;

            if (!data.vertexGroups.has(key)) data.vertexGroups.set(key, groupCounter++);
            
            const groupId = data.vertexGroups.get(key);
            data.indexTex.set([i, groupId, 0.0, 0.0], i*4);
            data.index[i] = i;
            data.groupIndex[i] = groupId;
        }
        
    }

    return data;
}

// Buffer geometry object is created and populated with the above sorted data. 
// This is the object which will be used in the FBO.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getGeometryPosition(vertexPositions: any) {

    const geometry = new THREE.BufferGeometry();
    const vertexCount = vertexPositions.count;
    const positions = new Float32Array(vertexCount*3);
    const new_uvs = new Float32Array(vertexCount*2);
    const resolution = vertexPositions.resolution;
    const indices = new Float32Array(vertexCount);

    for (let i=0; i<vertexCount; i++) {

        positions[i*3+0] = vertexPositions.flatPositions[i*4+0];
        positions[i*3+1] = vertexPositions.flatPositions[i*4+1];
        positions[i*3+2] = vertexPositions.flatPositions[i*4+2];

        const x = i%resolution;
        const y = Math.floor(i/resolution);

        new_uvs [i*2+0] = (x+0.5)/resolution;
        new_uvs [i*2+1] = (y+0.5)/resolution;
        indices[i] = i;
    }
    
    const index = vertexPositions.index;

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(new_uvs, 2));
    geometry.setAttribute("aIndex", new THREE.BufferAttribute(index, 1));
    geometry.setAttribute("gIndex", new THREE.BufferAttribute(vertexPositions.groupIndex, 1));

    return geometry;
}


// These next two functions are used to sort object props into a Float array for compatibility with glsl shaders. 
// This is used for noise and wave parameters in the Water component
export function getParams(params: object): Float32Array {
    
    const data_in = new Float32Array(8);
    let count = 0;

    for (const [key, value] of Object.entries(params)) {
        data_in.set([value], count);
        count++;
    }

    if (count < 7) {
        data_in.set([1.0], 7);
    }

    return data_in;
}

export function getDetailParams(params: object, num: number, length: number): Float32Array {

    const data_in = new Float32Array(length*num);

    for (let i=0; i<num; i++) {

        let count = 0;
        
        for (const [key, value] of Object.entries(params)) {
            data_in.set([value[i]], i*length+count);
            count++;
        }

        for (let j=1; j<3; j++) {
            if (count < length-j) {
                data_in.set([1.0], length*i-j);
            }
        }
    }

    return data_in;
}