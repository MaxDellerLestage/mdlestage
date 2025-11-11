import { useFrame } from '@react-three/fiber';
import React, {useLayoutEffect, useRef, useState} from 'react';
import { useVidStore } from '../../../stores/useVidStore';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import * as THREE from 'three';

/*
    This component is used exclusively in src/components/Content_components/Animation/AnimContent.
    It contains the actual video player.
*/

interface VidProps {
    height?: number;
    width?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
}

export const VidDisplay: React.FC<VidProps> = ({
    height = 2,
    width = 2,
    position = new THREE.Vector3(0,0,0),
    rotation = new THREE.Euler(0,0,0)
}) => {

    const { vidList, video } = useVidStore((state) => state);
    const pages = useGlobalStore((state) => state.pages);
    const [anim, setAnim] = useState(true);
    const meshRef = useRef<THREE.Mesh | null>(null);
    
    useLayoutEffect(() => {
        if (video) {
            video.currentTime = 0;
            video.pause();
            if (meshRef.current) {
                meshRef.current.scale.x = 0.001;
                meshRef.current.scale.y = 0.001;
            }
        }
    }, [pages]);

    useFrame(() => {
        if (!video) return

        if (video && vidList && video.readyState >= video.HAVE_CURRENT_DATA) {
            position.z += 0.01;
            vidList.needsUpdate = true;
        }
    });

    useFrame((state, delta) => {

        if (meshRef.current && anim && meshRef.current.scale.x < 1) {
            meshRef.current.scale.x *= 200*delta;
        }
        if (meshRef.current && meshRef.current.scale.x >= 1) {
            meshRef.current.scale.x = 1;
        }
        if (meshRef.current && anim && meshRef.current.scale.y < 1 && meshRef.current.scale.x >= 1) {
            meshRef.current.scale.y *= 200*delta;
        }
        if (meshRef.current && meshRef.current.scale.y >= 1) {
            meshRef.current.scale.y = 1;
            setAnim(false);
        }
    });
    
    return (
        <>
            <mesh 
                ref={meshRef}
                position={position}
                rotation={rotation}
                receiveShadow
                castShadow
            >
                <planeGeometry args={[width, height]}  />
                <meshStandardMaterial map={vidList} toneMapped={false}/>
            </mesh>
        </>
    )
}