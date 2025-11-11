import React, { useRef } from 'react';
import { useModelStore } from '../stores/useModelStore';
import { Loading } from './Loading'
import * as THREE from 'three';

/*
    This component takes the loaded model data from useModelStore and returns it as a mesh to be displayed.
*/

export function Logo() {

    const { modelList, activeRes } = useModelStore((state) => state)
    const groupRef = useRef<THREE.Group | null>(null);
    const { nodes, materials } = modelList[activeRes] == null ? { nodes: null, materials: null } : modelList[activeRes];

    if (nodes == null || materials == null) {
        return <Loading />
    }

    return (
        <group ref={groupRef} dispose={null}>
            <mesh castShadow receiveShadow geometry={(nodes.Cube as THREE.Mesh).geometry} material={materials['Material']} position={[0,0,0]} rotation={[Math.PI, 0, Math.PI/1.94]}/>
        </group>
    )
}





