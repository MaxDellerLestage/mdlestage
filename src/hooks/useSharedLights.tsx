import { useFrame } from '@react-three/fiber';
import { useLightStore } from '../stores/useLightStore';
import * as THREE from 'three';
import * as React from 'react';

/*
    This hook passes three.js light data to a referenced object within a component.
    This is done so that the data can be passed down to the glsl shaders
*/

export type LightUniformsObject = {
    uLightPositions: THREE.Vector3[]
    uLightColors: THREE.Color[]
    uLightIntensities: number[]
    uSpecIntensities: number[]
    uViewPosition: THREE.Vector3
}

export type LightUniformsRef = React.RefObject<LightUniformsObject | null>;

export function useSharedLights(
    ref: LightUniformsRef
    
) {
    const lights = useLightStore((state) => state.lights)

    useFrame(({ camera }) => {
        if (!ref.current) return;
        
        if (!ref.current.uLightPositions || !ref.current.uLightColors) return;
        
        const lightPositions = lights.map((l) => new THREE.Vector3().copy(l.position));
        const lightColors = lights.map((l) => new THREE.Color().copy(l.color));
        const lightIntensities = lights.map((l) => l.intensity ?? 1);
        const specIntensities = lights.map((l) => l.spec_intensity ?? 1);
        
        ref.current.uLightPositions = lightPositions;
        ref.current.uLightColors = lightColors;
        ref.current.uLightIntensities = lightIntensities;
        ref.current.uSpecIntensities = specIntensities;
        ref.current.uViewPosition = camera.position.clone();
    })
}