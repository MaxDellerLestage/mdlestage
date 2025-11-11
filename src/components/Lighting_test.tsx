import { useFBO } from '@react-three/drei';
import { useFrame, extend } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import { RefractMaterial } from '../materials/RefractMaterial';
import { useSharedLights } from '../hooks/useSharedLights';
import { LightUniformsObject } from 'hooks/useSharedLights';

/*
    This component creates the refraction effect displayed in the /home and /computers paths.
*/

extend({ RefractMaterial });

interface GeoProps {
    position?: THREE.Vector3;
    light_count?: number;
    size?: number;
    iorR?: number;
    iorG?: number;
    iorB?: number;
    chrom_ab?: number;
    refraction?: number;
    saturation?: number;
    spec_mult?: number;
    diff_mult?: number;
    spec_pow?: number;
    fresnel?: number;
    light_intensity?: number;
    distance_mult?: number;
    opacity?: number;
}

const Geometries: React.FC<GeoProps> = ({
    position = new THREE.Vector3(0,0,-0.3),
    light_count = 4,
    size = 1,
    iorR = 1.31,
    iorG = 1.32,
    iorB = 1.33,
    chrom_ab = 0.3,
    refraction = 0.2,
    saturation = 1.03,
    spec_mult = 2.0,
    diff_mult = 1.0,
    spec_pow = 2.0,
    fresnel = 1.0,
    light_intensity = 0.1,
    distance_mult = 0.9,
    opacity = 1.0
}) => {

    const mesh = useRef<THREE.Mesh | null>(null);
    const mainRenderTarget = useFBO();
    const refractMaterialRef = useRef<LightUniformsObject>(null);

    // This custom hook passes all three.js light information to the shaders.
    useSharedLights(refractMaterialRef);
    
    useFrame((state) => {
        const { gl, scene, camera, clock } = state;
        if (mesh.current) {

            mesh.current.visible = false;
            // Using the frame buffer object is crucial for this effect to work. 
            // Unlike the other FBO used elsewhere in the codebase, no computations are done within the FBO, 
            // but rather the data texture output from the FBO is used to project and alter the main shader output
            gl.setRenderTarget(mainRenderTarget);
            gl.clearColor();
            gl.clear(true, true, true);
            gl.render(scene, camera);

            (mesh.current!.material as THREE.ShaderMaterial).uniforms.uTexture.value = mainRenderTarget.texture;

            gl.setRenderTarget(null);

            mesh.current.visible = true;

            (mesh.current!.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <>
            <mesh ref={mesh} position={position}>
                <icosahedronGeometry args={[size, 12]} />
                <refractMaterial
                    attach="material"
                    ref={refractMaterialRef}
                    uLightCount={light_count}
                    uTexture={null}
                    winResolution={
                        new THREE.Vector2(
                            window.innerWidth,
                            window.innerHeight
                        ).multiplyScalar(Math.min(window.devicePixelRatio, 2))
                    }
                    uIorR={iorR}
                    uIorG={iorG}
                    uIorB={iorB}
                    uChromAb={chrom_ab}
                    uRefraction={refraction}
                    uSaturation={saturation}
                    uSpecmult={spec_mult}
                    uDiffmult={diff_mult}
                    uSpecpow={spec_pow}
                    uFresnel={fresnel}
                    uIntensity={light_intensity}
                    uDistanceMult={distance_mult}
                    uOpacity={opacity}
                    uTime={0.0}
                    key={uuidv4()}
                    blending={THREE.AdditiveBlending}
                    depthWrite={true}
                    transparent={true}
                    wireframe={false}
                />
            </mesh>
        </>
    )
}

export default Geometries;

