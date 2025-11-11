import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import baseVert from "../shaders/Water/vertexShader.glsl";
import noiseShader from "../shaders/chunks/noise_01.glsl";
import baseFrag from "../shaders/Water/fragmentShader.glsl";
import lightingShader from "../shaders/chunks/lighting.glsl";
import aoShader from "../shaders/chunks/getAO.glsl";
import rotShader from "../shaders/chunks/matRotation.glsl";
import piShader from "../shaders/chunks/PI.glsl";

/*
    This material is used so that the Water component can interact with the scene lights.
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

const WaterMaterial = shaderMaterial(
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

        uPositionTex: new THREE.DataTexture(
                    new Float32Array(1),
                ),
        uPos: new THREE.Vector3(),
        uNormalTex: new THREE.DataTexture(
                    new Float32Array(1),
                ),
        uColorTex: new THREE.DataTexture(
                    new Float32Array(1),
                ),
        
        uTextureSize: 1,
        uValidCount: 1,
        uTextureWidth: 1,
        uTextureHeight: 1,
        uSpecmult: 1.0,
        uDiffmult: 1.0,
        uSpecpow: 2.0,
        uFresnel: 0.1,
        uIntensity: 1.0,
        uDistanceMult: 0.5,
        uOpacity: 1.0,

        uTime: 0.0,
    },
    vertexShader,
    fragmentShader
)

export { WaterMaterial };
