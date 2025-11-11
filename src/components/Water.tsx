import { useMemo, useRef } from "react";
import { extend, useFrame, createPortal } from '@react-three/fiber';
import { useFBO } from "@react-three/drei";
import * as THREE from 'three';
import '../styles/index.css';
import { useSharedLights } from '../hooks/useSharedLights';
import type { LightUniformsObject } from '../hooks/useSharedLights';
import { WaterMaterial } from '../materials/WaterMaterial';
import { WaterFBOMaterial } from "../materials/WaterFBOMaterial";
import { getTexturePosition, getGeometryPosition, getParams, getDetailParams } from "../functions/fboHelper";

/*
    This component contains the fluid effect displayed in the /computers path.
*/

extend({ WaterMaterial });
extend({ WaterFBOMaterial: WaterFBOMaterial });

interface WaterProps {
    water_res?: number;
    light_count?: number;
    loading?: boolean;

    // Water settings

    position?: THREE.Vector3;
    size?: number;
    opacity_master?: number;
    opacity?: number;
    color_1?: THREE.Color;
    color_2?: THREE.Color;
    color_mult?: number;

    loop_time?: number;

    noise?: object;
    mask?: object;
    
    amp_mult?: number;

    wave_num?: number;
    waves?: object;
    
    ao_intensity?: number;
    ao_range?: number;

    spec_mult?: number;
    diff_mult?: number;
    spec_pow?: number;
    fresnel?: number;
    light_intensity?: number;
    distance_mult?: number;

    // Transformation settings
    yaw?: number;
    pitch?: number;
    tilt?: number;

    yaw_speed?: number;
    pitch_speed?: number;
    tilt_speed?: number;
}

export const Water: React.FC<WaterProps> = ({
    water_res = 59,
    light_count = 2,
    loading = false,
    // Water settings

    position = new THREE.Vector3(0,0,-3),

    size = 0.4,

    opacity_master = 1.0,
    color_1 = new THREE.Color("rgb(0,100,255)"),
    color_2 = new THREE.Color("rgb(150,50,255)"),
    color_mult = 0.1,
    amp_mult = 1.5,
    loop_time = 10.0,

    noise = {
        scale: 0.8,
        f_value: 0.0,
        f_amp: 1.7,
        f_freq: 1.3,
        octaves: 8,
        gain: 2.0,
        offset: 1.0,
    },
    
    mask = {
        scale: 0.5,
        value: 0.0,
        amp: 0.2,
        freq: 1.5,
        octaves: 8,
        gain: 2.0,
        offset: 1.0,
    },
    
    wave_num = 1,
    waves = {
        amp: [0.1],
        freq: [2.0],
        speed: [2.0],
        start: [-99.0],
        end: [99.0],
        falloff: [6.0],
        tilt: [0.1],
        pitch: [0.05],
        yaw: [0.0],
        tilt_speed: [1.0],
        pitch_speed: [1.0],
        yaw_speed: [0.0],
        bias_start: [-3.0],
        bias_end: [3.0],
        bias_power: [0.1],
    },

    ao_intensity = 0.1,
    ao_range = 0.5,

    spec_mult = 1.0,
    diff_mult = 1.0,
    spec_pow = 2.0,
    fresnel = 0.0,
    light_intensity = 1.0,
    distance_mult = 0.5,

    // Transformation settings
    yaw = 0.0,
    pitch = 0.0,
    tilt = 0.0,
    yaw_speed = 0.0,
    pitch_speed = 0.0,
    tilt_speed = 0.0
}) => {

    // Parameter setup

    // These parameters call helper functions 
    // getTexturePosition, getGeometryPosition, getParams, and getDetailParams 
    // from /src/functions/fboHelper.

    const vertexPositions = useMemo(() => {
        if (loading == true) {
            return getTexturePosition(water_res)
        } else {
            return getTexturePosition(19);
        }
    }, [loading, water_res]);

    const pointCloudGeometry = useMemo(() => {
        return getGeometryPosition(vertexPositions);
    }, [vertexPositions]);

    const noise_params = useMemo(() => {
        return getParams(noise);
    }, [noise]);

    const mask_params = useMemo(() => {
        return getParams(mask);
    }, [mask])

    const wave_params = useMemo(() => {
        return getDetailParams(waves, wave_num, 16);
    }, [waves, wave_num])

    //FBO set up
    // See /src/components/New_neb for details on frame buffer object.
    
    const dpr = 1;

    const positions = new Float32Array([-dpr, -dpr, 0, dpr, -dpr, 0, dpr, dpr, 0, -dpr, -dpr, 0, dpr, dpr, 0, -dpr, dpr, 0]);
    const uvs = new Float32Array([
        0, 0,
        dpr, 0,
        dpr, dpr,
        0, 0,
        dpr, dpr,
        0, dpr
    ]);

    const fboPosition = useFBO(vertexPositions.resolution, vertexPositions.resHeight, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
        depthBuffer: false,
        type: THREE.FloatType,
        count: 3
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const fboUniforms = useMemo(() => (
        {   center: position,

            init_positions: vertexPositions.flatPositions,
            index: vertexPositions.indexTex,
            vertex_count: vertexPositions.count,

            size: size,
            color_1: color_1,
            color_2: color_2,
            color_mult: color_mult,

            loop_time: loop_time,

            noise_params: noise_params,
            
            mask_params: mask_params,

            wave_params: wave_params,
            num_waves: wave_num,

            amp_mult: amp_mult,

            opacity_master: opacity_master,

            ao_intensity: ao_intensity,
            ao_range: ao_range,

            yaw: yaw,
            pitch: pitch,
            tilt: tilt,
            yaw_speed: yaw_speed,
            pitch_speed: pitch_speed,
            tilt_speed: tilt_speed

        }
    ), [
            position,

            vertexPositions,

            size,
            color_1,
            color_2,
            color_mult,

            loop_time,

            noise_params,

            mask_params,

            wave_params,
            wave_num,

            amp_mult,

            opacity_master,

            ao_intensity,
            ao_range,

            yaw,
            pitch,
            tilt,
            yaw_speed,
            pitch_speed,
            tilt_speed
    ]);

    const scene = useMemo(() => new THREE.Scene(), []);
    const other_camera = new THREE.OrthographicCamera(-dpr, dpr, dpr, -dpr, dpr/Math.pow(2,53), 1);
    const water = useRef<THREE.Mesh | null>(null);
    const waterMaterialRef = useRef<LightUniformsObject>(null);
    const FBOMaterialRefPos = useRef<WaterFBOMaterial | null>(null);
    
    const fboMaterialPos = useMemo(() => {
        const mat = new WaterFBOMaterial(fboUniforms);
        FBOMaterialRefPos.current = mat;
        return mat;
    }, [fboUniforms]);

    //FBO passes
    
    useFrame((state) => {
        const { gl, clock } = state;
        
        gl.autoClear = false;
        
        fboMaterialPos.uniforms.uPass.value = 0;
        fboMaterialPos.uniforms.uTime.value = clock.elapsedTime;
        gl.setRenderTarget(fboPosition);
        gl.clear();
        gl.render(scene, other_camera);
        gl.setRenderTarget(null);

        if ((water.current?.material as THREE.ShaderMaterial).uniforms) {
            (water!.current!.material as THREE.ShaderMaterial).uniforms.uPositionTex.value = fboPosition.textures[0];
            (water!.current!.material as THREE.ShaderMaterial).uniforms.uNormalTex.value = fboPosition.textures[1];
            (water!.current!.material as THREE.ShaderMaterial).uniforms.uColorTex.value = fboPosition.textures[2];
        }
    })

    // This custom hook passes all three.js light information to the shaders.
    useSharedLights(waterMaterialRef);

    return (
    <>
        {createPortal(
            <mesh>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-uv"
                        args={[uvs, 2]}
                    />
                    <bufferAttribute
                        attach="attributes-aIndex"
                        args={[vertexPositions.index, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-gIndex"
                        args={[vertexPositions.groupIndex, 1]}
                    />
                </bufferGeometry>
                <primitive
                    attach="material"
                    object={fboMaterialPos}
                />
            </mesh>,
            scene
        )}
        <mesh
            ref={water}
            position={position}
            scale={size}
        >
            <primitive object={pointCloudGeometry} attach="geometry"/>
            <waterMaterial
                attach="material"
                ref={waterMaterialRef}
                uLightCount={light_count}
                uPos={position}
                uPositionTex={fboPosition.textures[0]}
                uNormalTex={fboPosition.textures[1]}
                uColorTex={fboPosition.textures[2]}
                uTextureSize={vertexPositions.size}
                uValidCount={vertexPositions.count}
                uTextureWidth={vertexPositions.resolution}
                uTextureHeight={vertexPositions.resHeight}
                uSpecmult={spec_mult}
                uDiffmult={diff_mult}
                uSpecpow={spec_pow}
                uFresnel={fresnel}
                uIntensity={light_intensity}
                uDistanceMult={distance_mult}
                uOpacity={opacity_master}
                depthWrite={true}
                transparent={false}
                wireframe={false}
            />
        </mesh>
    </>
    )

    
}