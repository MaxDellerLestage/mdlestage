import * as THREE from 'three';

export const randomXYZ = (min = 0, max = 255): [number, number, number] => {

    const clamp = (value: number) => Math.max(min, Math.min(max, value));
    const x = clamp(Math.floor(Math.random() * (max - min + 1) + min));
    const y = clamp(Math.floor(Math.random() * (max - min + 1) + min));
    const z = clamp(Math.floor(Math.random() * (max - min + 1) + min));
    
    return [x, y, z];
}

export const randInt = (max: number): number => {
    return Math.floor(Math.random() * max);
}

export const DegToRad = (rad: number): number => {
    return rad * (Math.PI/180);
}

export const rotateObject = (rot_vector: THREE.Vector3, rotation: number[]): THREE.Vector3 => {

    const in_vector = rot_vector;
    const matrix = new THREE.Matrix4();

    matrix.makeRotationX(DegToRad(rotation[0]));
    in_vector.applyMatrix4(matrix);
    matrix.makeRotationY(DegToRad(rotation[1]));
    in_vector.applyMatrix4(matrix);
    matrix.makeRotationZ(DegToRad(rotation[2]));
    in_vector.applyMatrix4(matrix);

    const out_vector = in_vector;


    return out_vector;
}

export const scaleObject = (scale_vector: THREE.Vector3, scale_amt: number): THREE.Vector3 => {

    scale_vector.x /= scale_amt;
    scale_vector.y /= scale_amt;
    scale_vector.z /= scale_amt;

    const out_vector = scale_vector;

    return out_vector;
}

export const translateObject = (trans_vector: THREE.Vector3, trans_amt: THREE.Vector3): THREE.Vector3 => {

    trans_vector.x += trans_amt.x;
    trans_vector.y += trans_amt.y;
    trans_vector.z += trans_amt.z;

    const out_vector = trans_vector;

    return out_vector;
}