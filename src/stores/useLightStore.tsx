import { create } from 'zustand';
import type { LightData } from '../types/Light';
import * as THREE from 'three';

/*
    The light store is used to pass light data between components.
*/

interface LightState {
    lights: LightData[]
    updateLight: (index: number, data: Partial<LightData>) => void
}

export const useLightStore = create<LightState>((set) => ({
    lights: [
        {
            position: new THREE.Vector3(-40.0,0.0,70.0),
            color: new THREE.Color(0.7,0.6,0.4),
            intensity: 40.0,
            spec_intensity: 1.0,
        },
        {
            position: new THREE.Vector3(0.0, 30.0, 0.0),
            color: new THREE.Color(1.0,0.2,0.2),
            intensity: 20.0,
            spec_intensity: 1.0,
        },
        {
            position: new THREE.Vector3(0.0, -20.0, -10.0),
            color: new THREE.Color(0.3,0.2,0.9),
            intensity: 20.0,
            spec_intensity: 0.5,
        }
    ],

    updateLight: (index, data) =>
        set((state) => {
            const newLights = [...state.lights];
            newLights[index] = { ...newLights[index], ...data };
            return { lights: newLights };
        }),
}))

