import { useFrame, extend, createPortal} from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import '../styles/index.css';
import vertexShader from '../shaders/Nebula/vertexShader.glsl';
import fragmentShader from '../shaders/Nebula/fragmentShader.glsl';
import { useGlobalStore } from '../stores/useGlobalStore';
import { FboMaterial } from '../materials/FBOMaterial';

/*
    This component returns the particle effect displayed on the /home path as well as the line animation
    when hovering over menu items.
*/

extend({ FboMaterial: FboMaterial});

interface NebulaProps {
    count?: number;
    radius?: number;
    position?: THREE.Vector3;
    scale?: number;
    neb_scale?: number;
    rotation?: number[];
    line_length?: number;
    line_speed?: number;
    rot_anim?: number;
    
    init_color?: number[];
    color_x?: number[];
    color_y?: number[];
    color_z?: number[];
    color_mult?: number;
    saturation?: number;
    amp?: number;

    gradient?: number;
    gradient_size?: number;
    gradient_offset?: number[];

    size?: number;
    min_size?: number;
    density?: number;

    n_displacement?: number;
    n_scale?: number;
    n_value?: number;
    n_amp?: number;
    n_freq?: number;
    n_octaves?: number;
    n_gain?: number;
    n_offset?: number;

    neb_id?: string;
    alpha?: number;
    fade?: number;

    neb_number?: number;
}

export const Nebula: React.FC<NebulaProps> = ({
    count = 256,
    radius = 0.008,
    position = new THREE.Vector3(0,0,-6),
    neb_scale = 0.0015,
    scale = 7.0,
    rotation = [0,0.1,-0.3],
    rot_anim = 0.001,
    line_length = 0,
    line_speed = 0,

    init_color = [0,0,0],
    color_x = [0.1, 0.15],
    color_y = [0.2, 1.0],
    color_z = [0.7, 1.0],
    color_mult = 0.0006,
    saturation = 5.0,
    
    gradient = 2.2,
    gradient_size = 3.2,
    gradient_offset = [0,0,0],

    size = 7.0,
    min_size = 0.5,
    density = 0.0000001,

    n_displacement = 0.5,
    n_scale = 1.0,
    n_value = 0.0,
    n_amp = 1.2,
    n_freq = 0.2,
    n_octaves = 8,
    n_gain = 2.0,
    n_offset = 1.0,

    fade = 5.0,
    alpha = 0.6,

    neb_id = "Neb_B",
    neb_number = 1
    
}) => {

    const global_anim = useGlobalStore((state) => state.global_anim);
    const elapsed = useRef(0);
    const points = useRef<THREE.Points | null>(null);
    const FBOMaterialRef = useRef<FboMaterial>(null);
    const scene = useMemo(() => new THREE.Scene(), []);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1/Math.pow(2,53), 1);
    
    // These two arrays are used to instatiate the frame buffer object.
    const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
    const uvs = new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 0,
        1, 1,
        0, 1
    ]);

    // The frame buffer object allows computations to happen in UV space instead of per vertex, 
    // saving costly calculation time and allowing a greater number of particles without performance hit.
    const fboPosition = useFBO(count, count, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        stencilBuffer: false,
        depthBuffer: false,
        type: THREE.FloatType,
        count: 3
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const localClock = useRef(new THREE.Clock());

    const particlesPosition = useMemo(() =>{
        const length = count*count;
        const particles = new Float32Array(length * 3);
        for (let i=0; i<length; i++) {
            const i3 = i * 3;
            particles[i3+0] = (i%count)/count;
            particles[i3+1] = i/count/count;
        }
        return particles
    }, [count]);

    // This useFrame controls the particle animation during the transition to another path.
    useFrame((state, delta) => {
        const { clock } = state;

        (points.current!.material as THREE.ShaderMaterial).uniforms.uTime.value += clock.elapsedTime;

        if (global_anim) {

            elapsed.current += delta;

            if (FBOMaterialRef.current) {
                FBOMaterialRef.current.uniforms.uIncrement.value += Math.pow(6000.0, elapsed.current);
            }
        }
    })

    // This useFrame passes the calculated data from the frame buffer object to the main shader. 
    // Multiple passes are used to control position, color, and size within the same FBO.
    useFrame((state) => {
        
        const { gl } = state;

        gl.autoClear = false;

        const material = FBOMaterialRef.current;
        
        material!.uniforms.uPass.value = 0;
        
        gl.setRenderTarget(fboPosition);
        gl.clear();
        gl.render(scene, camera);
        gl.setRenderTarget(null);
        
        if ((points.current!.material as THREE.ShaderMaterial).uniforms) {
            (points.current!.material as THREE.ShaderMaterial).uniforms.uPositionTex.value = fboPosition.textures[0];
            (points.current!.material as THREE.ShaderMaterial).uniforms.uColorTex.value = fboPosition.textures[1];
            (points.current!.material as THREE.ShaderMaterial).uniforms.uSizeTex.value = fboPosition.textures[2];
        }

        FBOMaterialRef.current!.uniforms.uTime.value = localClock.current.getElapsedTime();

        points.current!.rotation.z += rot_anim;
    });

    const uniforms = useMemo(() =>({
        uPositionTex: {
            value: null
        },
        uColorTex: {
            value: null
        },
        uSizeTex: {
            value: null
        },
        uPos: {
            value: position
        },
        uFade: {
            value: fade
        },
        uAlpha: {
            value: alpha
        },
        uTime: {
            value: 0.0
        }
    }), [
            position, 
            fade,
            alpha
        ]);

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
                    </bufferGeometry>
                    <fboMaterial 
                        attach="material" 
                        ref={FBOMaterialRef} 
                        args={[
                                count, 
                                radius, 
                                position, 
                                scale, 
                                rotation,
                                init_color,
                                color_x,
                                color_y,
                                color_z,
                                color_mult,
                                saturation,

                                
                                gradient,
                                gradient_size,
                                gradient_offset,
                                
                                size,
                                min_size,
                                density,

                                n_displacement,
                                n_scale,
                                n_value,
                                n_amp,
                                n_freq,
                                n_octaves,
                                n_gain,
                                n_offset, 
                                neb_id,
                                neb_number,
                                line_length,
                                line_speed
                            ]} 
                    />
                </mesh>,
                scene
            )}
            <points ref={points}  position={position} scale={neb_scale} rotation={[rotation[0],rotation[1],rotation[2]]}>
                <bufferGeometry >
                    <bufferAttribute 
                        attach="attributes-position"
                        args={[particlesPosition, 3]}
                    />
                </bufferGeometry>
                <shaderMaterial
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    transparent={true}
                    fragmentShader={fragmentShader}
                    vertexShader={vertexShader}
                    uniforms={uniforms}
                />
            </points>
        </>
    )
}

