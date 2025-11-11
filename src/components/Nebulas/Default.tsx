import * as THREE from "three";
import { Vector3 } from 'three';
import { rotateObject, scaleObject, translateObject } from '../../utils';

/*
    This file is used to precompute particle positions for the effect on the 'Home' page.
    Further computations and movement are handled in the 'Nebula' shaders.
*/

export const Default = (count: number, radius: number, position: THREE.Vector3, scale: number, rotation: number[], part_id: number) => {
    const distance = Math.sqrt(Math.random()**1.5) * radius;
    const theta_2 = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);

    const strength = 1;
    const rad = 100;
    const theta = part_id*(((16*Math.PI)/count));
    const a = 100;
    const n =100;
    const r = rad+a*Math.sin(n*theta);

    let x = position.x;
    let y = position.y;
    let z = position.z;

    x = r * Math.cos(theta)*(part_id/count);
    y = r * Math.sin(theta)*(part_id/count);
    z = (Math.cos(n*theta)*a)*part_id/count;

    const x1 = rad*Math.cos(theta)*(part_id/count);
    const y1 = rad*Math.sin(theta)*(part_id/count);
    let z1 = 0;
    z1 += ((part_id/count)*3*rad)**strength;


    z += z1;
    y += (Math.sin(z*0.02)*64)*(part_id/count)*8;
    x += (Math.sin(z*0.04)*64)*(part_id/count)*8;
    
    x += (distance * Math.sin(theta_2) * Math.cos(phi));
    y += (distance * Math.sin(theta_2)*Math.sin(phi));
    z += (distance * Math.cos(theta_2))*2;
    

    const rot_pos = new Vector3(x,y,z);
    const rot_pos_init = new Vector3(x1, y1, z1);

    rotateObject(rot_pos, rotation);
    scaleObject(rot_pos, scale);
    translateObject(rot_pos, position);

    rotateObject(rot_pos_init, rotation);
    scaleObject(rot_pos_init, scale);
    translateObject(rot_pos_init, position);
    
    const pos_result = new Float32Array(4);
    const init_result = new Float32Array(4);

    pos_result.set([rot_pos.x, rot_pos.y, rot_pos.z, part_id], 0);
    init_result.set([rot_pos_init.x, rot_pos_init.y, rot_pos_init.z, part_id], 0);

    return {pos: pos_result, init: init_result}

}