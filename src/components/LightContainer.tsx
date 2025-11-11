import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGlobalStore } from '../stores/useGlobalStore';
import { useFrame } from '@react-three/fiber';

/*
    This component acts as a container for all light objects on the home page.
*/

interface LightProps {
    light_count?: number;
    light_intensity?: number[];
    light_pos?: THREE.Vector3[];
    light_color?: THREE.Color[];
}

export const LightContainer: React.FC<LightProps> = ({
    light_count = 1,
    light_intensity = [1.0],
    light_pos = [new THREE.Vector3(0,0,0)],
    light_color = [new THREE.Color(0,0,0)]

}) => {

    const first_load = useGlobalStore((state) => state.first_load);
    const setFirstLoad = useGlobalStore((state) => state.setFirstLoad);

    const lightRefs = useRef<THREE.PointLight[]>([]);

    const animIntensityRef = useRef<number[]>(
        new Array(light_count).fill(0.0)
    );

    // Checks for initial site load. If the user is just navigating back to the home page, then lights are set at full intensity.
    useEffect(() => {
        if (!first_load) {
            for (let i=0; i<light_count; i++) {
                const target = light_intensity[i] ?? 1.0;
                animIntensityRef.current[i] = target;

                if (lightRefs.current[i]) {
                    lightRefs.current[i].intensity = target;
                }
            }
        }
    }, [first_load, light_intensity, light_count]);

    // Animates light intensity on first load and light color changes throughout
    useFrame(({ clock }) => {
        if (first_load) {
            let allReached = true;
            for (let i=0; i<light_count; i++) {
                
                const target = light_intensity[i] ?? 1.0;
                const current = animIntensityRef.current[i];

                if (current < target) {

                    animIntensityRef.current[i] += target*0.02;

                    if (animIntensityRef.current[i] > target) {
                        animIntensityRef.current[i] = target;
                    }
                    if (lightRefs.current[i]) {
                        lightRefs.current[i].intensity = animIntensityRef.current[i];
                    }

                    allReached = false;
                }
            }

            if (allReached) {
                setFirstLoad(false);
            }
        }

        for (let i=0; i<light_count; i++) {
            if (lightRefs.current[i]) {
                lightRefs.current[i].color.r = 0.5 + 0.5 * Math.sin(clock.elapsedTime);
                lightRefs.current[i].color.b = 0.5 + 0.5 * Math.cos(clock.elapsedTime*0.4);
                lightRefs.current[i].intensity = (0.2 + 0.8 * (0.5 + 0.5 * Math.sin(clock.elapsedTime*0.2*(i+8)))) * light_intensity[i];
            }
        }
    });

    return (
        <>
            {Array.from({ length: light_count }).map((_, i) => {
                return(
                    <pointLight
                        key={i}
                        ref={(el) => {
                            if (el) lightRefs.current[i] = el;
                        }}
                        intensity={animIntensityRef.current[i]}
                        position={light_pos[i]}
                        color={light_color[i]}
                    />
                )
            })}
        </>
    )
}