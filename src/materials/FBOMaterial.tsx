import * as THREE from 'three';
import baseVert_1 from '../shaders/Nebula/Simulation/vertexShader.glsl';
import baseFrag_1 from '../shaders/Nebula/Simulation/fragmentShader.glsl';

import baseVert_3 from '../shaders/Nebula_3/Simulation/vertexShader.glsl';
import baseFrag_3 from '../shaders/Nebula_3/Simulation/fragmentShader.glsl';

import piShader from '../shaders/chunks/PI.glsl';
import noiseShader from '../shaders/chunks/noise_01.glsl';
import randShader from '../shaders/chunks/random.glsl';
import { Neb_A } from '../components/Nebulas/Neb_A';
import { Default } from '../components/Nebulas/Default';

/*
    This material is used in the New_neb FBO.
*/

// Two arrays are populated with position data. 
// 'init_pos' represents the position after calculating the initial shape, 
// and 'data' represents the position after expanding the circumference of the shape. 
// These two positions are used to compute distance for size and color variation
const getData = (width: number, height: number, radius: number, position: THREE.Vector3, scale: number, rotation: number[], neb_id: string) => {

    const length = width * height;
    const data = new Float32Array(length*4);
    const init_pos = new Float32Array(length*4);

    for (let i=0; i<length; i++) {

        const new_positions = {
            send_position: new Float32Array(4),
            init_position: new Float32Array(4)
        }
        
        // This conditional chooses between the default or alternate CPU position computation. 
        // Possibility to add additional computations for more customization
        if (neb_id == "Neb_B") {
            const result = Default(length, radius, position, scale, rotation, i);
            new_positions.send_position = result.pos;
            new_positions.init_position = result.init;
        }

        if (neb_id == "Neb_A") {
            const result = Neb_A(length, radius, position, scale, rotation, i);
            new_positions.send_position = result.pos;
            new_positions.init_position = result.init;
        } 
        
        data.set(new_positions.send_position, i*4);
        init_pos.set(new_positions.init_position, i*4);
    }

    return {pos: data, init: init_pos};
}

// Here we take two color values for each of red, green, and blue channels. 
// We then return a random value between the first and second value for each channel.
const getColor = (count: number, color_x: number[], color_y: number[], color_z: number[]) => {
        const length = count*count;
        const colors = new Float32Array(length*4);
        for (let i=0; i<length; i++) {
            let send_color = [];
            const x = Math.min(Math.max(Math.sqrt(Math.random()), color_x[0]), color_x[1]);
            const y = Math.min(Math.max(Math.sqrt(Math.random()), color_y[0]), color_y[1]);
            const z = Math.min(Math.max(Math.sqrt(Math.random()), color_z[0]), color_z[1]);
            send_color = [x,y,z,1.0];
            colors.set(send_color, i*4);
        }
        return colors;
    }

// This is to populate the array for the size data texture, used to vary particle sizes.
const getSize = (count: number, p_size: number) => {
    const length = count*count;
    const sizes = new Float32Array(length*4);
    for (let i=0; i<length; i++) {
        const send_size = [p_size, 1.0, 1.0, 1.0];
        sizes.set(send_size, i*4);
    }

    return sizes;
}


class FboMaterial extends THREE.ShaderMaterial {
    constructor(size: number, 
                radius: number, 
                position: THREE.Vector3, 
                scale: number, 
                rotation: number[],

                init_color: number[],
                color_x: number[],
                color_y: number[],
                color_z: number[],
                color_mult: number,
                saturation: number,
                
                gradient: number,
                gradient_size: number,
                gradient_offset: number[],

                point_size: number,
                min_point_size: number,
                density: number,

                n_displacement: number,
                n_scale: number,
                n_value: number,
                n_amp: number,
                n_freq: number,
                n_octaves: number,
                n_gain: number,
                n_offset: number,
                
                neb_id: string,
                neb_number: number,
                line_length: number,
                line_speed: number
            ) {
        
        // The following section identifies which shader code will be used. 
        // 'neb_number' is chosen through a prop on the New_neb component
        let baseVert = baseVert_1;
        let baseFrag = baseFrag_1;

        if (neb_number == 3) {
            baseVert = baseVert_3;
            baseFrag = baseFrag_3;
        }

        const vertexShader = `
            ${baseVert}
            `

        const fragmentShader = `
            ${piShader}
            ${randShader}
            ${noiseShader}
            ${baseFrag}
            `

        // Creation of the data textures. 
        // This format is necessary for the FBO to function correctly in glsl and output usable data for the main shaders
        const tex = getData(size, size, radius, position, scale, rotation, neb_id);
        const position_tex = tex.pos;
        const init_tex = tex.init;


        const positionsTexture = new THREE.DataTexture(
            position_tex,
            size,
            size,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        const initTexture = new THREE.DataTexture(
            init_tex,
            size,
            size,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        const colorTexture = new THREE.DataTexture(
            getColor(size, color_x, color_y, color_z),
            size,
            size,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        const sizeTexture = new THREE.DataTexture(
            getSize(size, point_size),
            size,
            size,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        // The following parameters format the data textures.
        positionsTexture.needsUpdate = true;
        positionsTexture.wrapS = THREE.ClampToEdgeWrapping;
        positionsTexture.wrapT = THREE.ClampToEdgeWrapping;
        positionsTexture.magFilter = THREE.NearestFilter;
        positionsTexture.minFilter = THREE.NearestFilter;
        positionsTexture.generateMipmaps = false;
        initTexture.needsUpdate = true;
        initTexture.wrapS = THREE.ClampToEdgeWrapping;
        initTexture.wrapT = THREE.ClampToEdgeWrapping;
        initTexture.magFilter = THREE.NearestFilter;
        initTexture.minFilter = THREE.NearestFilter;
        initTexture.generateMipmaps = false;
        colorTexture.needsUpdate = true;
        colorTexture.wrapS = THREE.ClampToEdgeWrapping;
        colorTexture.wrapT = THREE.ClampToEdgeWrapping;
        colorTexture.magFilter = THREE.NearestFilter;
        colorTexture.minFilter = THREE.NearestFilter;
        colorTexture.generateMipmaps = false;
        sizeTexture.needsUpdate = true;

        const simulationUniforms = {
            uCount: { value: size },
            uRadius: { value: radius },
            uCenter: { value: position },
            uPos: { value: positionsTexture },
            uColor: { value: colorTexture },
            uInitPos: { value: initTexture },
            uInitColor: { value: init_color },
            uSaturation: { value: saturation },
            uSize: { value: sizeTexture },
            uMinSize: { value: min_point_size },
            uGradient: { value: gradient },
            uGradientSize: { value: gradient_size },
            uColorMult: { value: color_mult },
            uGradientOffset: { value: gradient_offset },
            uDensity: { value: density },
            uPass: { value: null },
            uDisplacement: { value: n_displacement },
            uScale: { value: n_scale},
            uValue: { value: n_value },
            uAmp: { value: n_amp },
            uFreq: { value: n_freq },
            uOctaves: { value: n_octaves },
            uGain: { value: n_gain },
            uOffset: { value: n_offset },
            uTime: { value: 0.0 },
            uIncrement: { value: 0.0},
            uLineLength: { value: line_length},
            uLineSpeed: { value: line_speed}
        };

        super({
            uniforms: simulationUniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
    }
}

export { FboMaterial };