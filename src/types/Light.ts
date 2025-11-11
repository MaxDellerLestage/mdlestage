import * as THREE from 'three';

export interface LightData {
    position: THREE.Vector3;
    color: THREE.Color;
    intensity: number;
    spec_intensity: number;
}