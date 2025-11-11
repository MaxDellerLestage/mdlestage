import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import baseVert from "../shaders/Lighting_test/vertexShader.glsl";
import noiseShader from "../shaders/chunks/noise_01.glsl";
import baseFrag from "../shaders/Lighting_test/fragmentShader.glsl";
import lightingShader from "../shaders/chunks/lighting.glsl";
import aoShader from "../shaders/chunks/getAO.glsl";
import rotShader from "../shaders/chunks/matRotation.glsl";
import piShader from "../shaders/chunks/PI.glsl";

/*
    This material is used so that the Lighting_test component's 
    shaders can interact with the scene lights. 

    Currently the lighting is disabled in the shader, 
    but keeping this set up will make it easy to re-activate 
    the lights or reuse the component elsewhere.
*/

const vertexShader = `
${piShader}
${noiseShader}
${rotShader}
${baseVert}
`

const fragmentShader = `
${piShader}
${noiseShader}
${lightingShader}
${aoShader}
${baseFrag}
`

const RefractMaterial = shaderMaterial(
    {
        uLightPositions: [
            new THREE.Vector3()
        ],
        uLightColors: [
            new THREE.Vector3()
        ],
        uLightIntensities: [1.0],
        uSpecIntensities: [1.0, 0.0],
        uViewPosition: new THREE.Vector3(),
        uLightCount: 2,
        
        uTexture: null,
        winResolution: new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),

        uIorR: 1.31,
        uIorG: 1.33,
        uIorB: 1.35,

        uChromAb: 0.5,
        uRefraction: 0.4,
        uSaturation: 1.0,

        uSpecmult: 1.0,
        uDiffmult: 1.0,
        uSpecpow: 2.0,
        uFresnel: 1.0,
        uIntensity: 1.0,
        uDistanceMult: 0.5,
        uOpacity: 1.0,

        uTime: 0.0  
    },
    vertexShader,
    fragmentShader
)

export { RefractMaterial };
