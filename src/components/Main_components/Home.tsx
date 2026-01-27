import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useLightStore } from '../../stores/useLightStore';
import { useGlobalStore } from '../../stores/useGlobalStore';
import { useModelStore } from '../../stores/useModelStore';

import { Loading } from '../../components/Loading';
import { Logo } from '../../components/Logo';
import { DisplayPage } from '../../components/DisplayPage';
import { Nebula } from '../../components/New_neb';
import Geometries from '../../components/Lighting_test';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';

/* 
    This is the component visible when site is first accessed or when path is either '/' or 'home'.
*/

interface HomeProps {
    category_names?: string[]
}

export const Home: React.FC<HomeProps> = ({ 
    category_names = ['Contact', 'Animation', 'Computers', 'Art']
}) => {

    const { pages }  = useGlobalStore((state) => state);
    const global_anim = useGlobalStore((state) => state.global_anim);
    const reverse_anim = useGlobalStore((state) => state.reverse_anim);
    const updateLight = useLightStore((state) => state.updateLight);
    const lowLoaded = useModelStore((state) => state.lowLoaded);
    const glowFactor = 0.8;
    const glowColor = useMemo(() => new THREE.Color(0.3*glowFactor, 0.8*glowFactor, 0.1*glowFactor), []);
    

    /*
        The following section controls the group which contains the model and lights.
        The group is updated each frame to have the z+ axis rotated towards the mouse pointer by a factor of 0.05
    */

    const groupRef = useRef<THREE.Group | null>(null);
    const { camera, pointer } = useThree();

    const baseQuat = useRef(new THREE.Quaternion());
    const desiredQuat = new THREE.Quaternion();
    const targetPos = new THREE.Vector3();

    useFrame(() => {
        if (!groupRef.current) return;

        // Ensure model does not follow the pointer while animating
        if (!global_anim && !reverse_anim) {
            targetPos.set(pointer.x, pointer.y, 0.5).unproject(camera);
            targetPos.sub(camera.position).normalize();
            targetPos.multiplyScalar(2).add(camera.position);

            const dummy = new THREE.Object3D();
            dummy.position.copy(groupRef.current.getWorldPosition(new THREE.Vector3()));
            dummy.lookAt(targetPos);
            desiredQuat.copy(dummy.quaternion);

            desiredQuat.premultiply(baseQuat.current);

            groupRef.current.quaternion.slerp(desiredQuat, 0.05);
        }
        // Reset rotations for return to home screen
        else if (reverse_anim) {
            groupRef.current.rotation.set(0, 0, 0);
        }
        
    });

    /*
        These light parameters are passed to useLightStore 
        in order to be able to use in various shaders throughout 
        the application.
    */

    const light_pos = useMemo(() => 
    [
        new THREE.Vector3(-2.2,0.09,1.27),
        new THREE.Vector3(-2.4,1.7,0.7),
        new THREE.Vector3(-3.8,-0.05,0.85),
        new THREE.Vector3(0.7,-0.5,1.0),
        new THREE.Vector3(1.5,-0.75,1.3),
        new THREE.Vector3(2.2,-0.75,1.1),
        new THREE.Vector3(2.2,-0.1,1.1),
        new THREE.Vector3(2.2,0.8,0.9),
        new THREE.Vector3(7.5,-3.0,0),
        new THREE.Vector3(8.3,-1.1,-3.9),
        new THREE.Vector3(8.1,0.2,-3.9),
    ], []);

    const light_color = useMemo(() =>
    [
        glowColor,
        glowColor,
        glowColor,
        glowColor,
        glowColor,
        glowColor,
        glowColor,
        glowColor,
        glowColor,
        glowColor,
        glowColor,
    ], []);

    const light_intensity = useMemo(() => 
    [
        5,
        5,
        5,
        3,
        1,
        3,
        3,
        3,
        30,
        10,
        10
    ], []);

    const light_count = useMemo(() =>
    light_pos.length, [light_pos]
    );

    
    useMemo(() => {
    for (let i=0; i<light_pos.length; i++) {
        updateLight(i, { 
            position: light_pos[i],
            color: light_color[i],
            intensity: light_intensity[i] 
        });
    }
    
    }, [light_pos, light_color, light_intensity, updateLight]);

    const init_menu_positions = 
    [
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(0, -5, 0),
        new THREE.Vector3(10, 0, 0),
    ];

    return (
        <>
            {lowLoaded ? 
                <>
                    <group
                        ref={groupRef}
                        dispose={null}
                        visible={pages[0].visible}
                    >
                        <Logo />
                        {pages[0].active ?
                            <>
                            <Environment
                                    resolution={256}
                                >
                                    <Lightformer
                                        position={[-0.08,0,0.2]}
                                        form="rect"
                                        intensity={5}
                                        rotation={[0,-Math.PI/2,0]}
                                        color={[0.1,1.0,1.0]}
                                        scale={[0.02,2,1]}
                                    />
                                    <Lightformer 
                                        position={[0,-3,4]}
                                        form="ring"
                                        intensity={1}
                                        color={[0.9, 0.1, 0.2]}
                                        scale={[5,1,1]}
                                    />
                                    <Lightformer 
                                        position={[0,6,2]}
                                        form="ring"
                                        intensity={1}
                                        color={[0.5, 0.1, 0.9]}
                                        scale={[5,5,1]}
                                    />
                                    <Lightformer 
                                        position={[-4,0,2]}
                                        form="ring"
                                        intensity={1}
                                        color={[0.5, 0.1, 0.9]}
                                        scale={[5,5,1]}
                                    />
                                    <Lightformer 
                                        position={[2,0,4]}
                                        form="ring"
                                        intensity={2}
                                        color={[0.9, 0.1, 0.2]}
                                        scale={[5,5,1]}
                                        
                                    />
                                </Environment>
                                <spotLight
                                    position={[0,20,5]}
                                    intensity={2000}
                                    rotation={[-Math.PI/2,0,0]}
                                    color={[0.6,0.1,0.6]}
                                />
                                </>
                            : null
                        }
                    </group>
                
                    {pages[0].active ?
                        <>
                            <DisplayPage
                                menu_items={category_names}
                                position={init_menu_positions}
                            />
                        </>
                        : null
                    }
                    <>
                        {pages[0].active ?
                            <>
                                <Nebula />
                                <Geometries
                                light_count={light_count}
                                size={1.35}
                                
                                chrom_ab={0.5}
                                refraction={3.2}
                                />      
                            </>
                            : null
                        }
                    </>
                </>
                : 
                <>
                    {pages[0].active ?
                        <Loading />
                        : null
                    }
                </>
            }
        </>
    )
            
}
