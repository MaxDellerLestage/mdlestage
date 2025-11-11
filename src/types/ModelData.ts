import * as THREE from 'three';

export interface ModelData {
    nodes?: {[name: string]: THREE.Object3D<THREE.Object3DEventMap>}
    materials?: {[name: string]: THREE.Material}
}