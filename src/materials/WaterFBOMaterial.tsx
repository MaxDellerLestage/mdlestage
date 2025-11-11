import * as THREE from 'three';
import baseVert from "../shaders/Water/Simulation/vertexShader.glsl";
import baseFrag from "../shaders/Water/Simulation/fragmentShader.glsl";
import noiseShader from "../shaders/chunks/noise_01.glsl";
import rotShader from "../shaders/chunks/matRotation.glsl";
import piShader from "../shaders/chunks/PI.glsl";
import aoShader from "../shaders/chunks/getAO.glsl";

/*
    This material is used to set the Water material's data textures for use in the FBO.
*/

const vertexShader = `
${baseVert}
`

const fragmentShader = `
${piShader}
${aoShader}
${noiseShader}
${rotShader}
${baseFrag}
`
// This function sets the correct parameters for a data texture. 
// Later on I iterate over all created data textures in the material. 
// I chose this method because it allows me to easily add more parameters later if necessary
function setTexture(object: THREE.DataTexture) {
    object.needsUpdate = true;
    object.wrapS = THREE.ClampToEdgeWrapping;
    object.wrapT = THREE.ClampToEdgeWrapping;
    object.magFilter = THREE.NearestFilter;
    object.minFilter = THREE.NearestFilter;
    object.generateMipmaps = false;
}

class WaterFBOMaterial extends THREE.ShaderMaterial{
    constructor(params:{

                    center: THREE.Vector3,

                    init_positions: Float32Array,
                    index: Float32Array,
                    vertex_count: number,

                    size: number,
                    color_1: THREE.Color,
                    color_2: THREE.Color,
                    color_mult: number,

                    loop_time: number,

                    noise_params: Float32Array,

                    mask_params: Float32Array,

                    wave_params: Float32Array,
                    num_waves: number,

                    amp_mult: number,

                    opacity_master: number,

                    ao_intensity: number,
                    ao_range: number,

                    // Transformation settings
                    yaw: number,
                    pitch: number,
                    tilt: number,

                    yaw_speed: number,
                    pitch_speed: number,
                    tilt_speed: number
                }    
    ) {

        const {
            center, init_positions, index, vertex_count,
            size, color_1, color_2,
            color_mult, loop_time, noise_params, mask_params,
            wave_params, num_waves, amp_mult, opacity_master,
            ao_intensity, ao_range,
            yaw, pitch, tilt, yaw_speed, pitch_speed, tilt_speed
        } = params;
 
        // These three data textures are used to pass the noise parameters to the FBO. 
        // Wrapping the data in a data texture minimizes the overhead for passing data to the shaders.
        const noiseTex = new THREE.DataTexture(
            noise_params,
            noise_params.length/4,
            1,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        const maskTex = new THREE.DataTexture(
            mask_params,
            mask_params.length/4,
            1,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        const waveTex = new THREE.DataTexture(
            wave_params,
            4,
            1,
            THREE.RGBAFormat,
            THREE.FloatType
        );


        // Here we create the data textures needed for position computations, as well as indexing 
        // so that the geometry and normals are reconstructed correctly in the shader.
        const textureWidth = Math.ceil(Math.sqrt(vertex_count));
        const textureHeight = Math.ceil(vertex_count/textureWidth);
        
        const paddedLength = textureWidth * textureHeight * 4;
        const paddedPositions = new Float32Array(paddedLength);
        const paddedIndex = new Float32Array(paddedLength);

        paddedPositions.set(init_positions);
        paddedIndex.set(index);

        const positionTexture = new THREE.DataTexture(
            paddedPositions,
            textureWidth,
            textureHeight,
            THREE.RGBAFormat,
            THREE.FloatType
        );

        const indexTexture = new THREE.DataTexture(
            paddedIndex,
            textureWidth,
            textureHeight,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        
        const texList = [
            noiseTex,
            maskTex,
            waveTex,
            positionTexture,
            indexTexture
        ];
        
        // Setting data texture parameters
        for (let i=0; i<texList.length; i++) {
            setTexture(texList[i]);
        }
        

        const simulationUniforms = {   
            uPos: { value: positionTexture },
            uPrevPos: { value: null },
            uNewNormal: { value: positionTexture },
            uIndexTex: { value: indexTexture },
            uVertexCount: { value: vertex_count },

            uTextureWidth: { value: textureWidth },
            uTextureHeight: { value: textureHeight },

            uSize: { value: size},
            uColor_1: { value: color_1},
            uColor_2: { value: color_2},
            uColormult: { value: color_mult},

            uLoopTime: { value: loop_time },

            uNoiseParams: { value: noiseTex },
            
            uMaskParams: { value: maskTex },

            uWaveParams: { value: waveTex },
            uNumWaves: { value: num_waves },

            uAmpMult: { value: amp_mult},

            uOpacity: { value: opacity_master },

            uYaw: { value: yaw},
            uTilt: { value: tilt},
            uPitch: { value: pitch},
            uYawSpeed: { value: yaw_speed},
            uTiltSpeed: { value: tilt_speed},
            uPitchSpeed: { value: pitch_speed},

            uAOIntensity: { value: ao_intensity},
            uAORange: { value: ao_range },

            uCenter: { value: center},
            uPass: { value: null },
            uTime: { value: 0 }
        };

    super({
        uniforms: simulationUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });
    }


    
}

export { WaterFBOMaterial };