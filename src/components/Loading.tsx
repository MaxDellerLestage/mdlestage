import React from 'react';
import * as THREE from 'three';
import { Text3D, Center } from '@react-three/drei';

/*
    This component is displayed on the /home path while the .glb model is loading.
*/

interface LoadingProps {
    text?: string;
    position?: THREE.Vector3;
}

export const Loading: React.FC<LoadingProps> = ({
    text = 'Loading',
    position = new THREE.Vector3(0,0,3)
}) => {

    return (
        <>  
            <group
                position={position}
            >
                <Center>
                    <Text3D font={'/fonts/Ethnocentric_Regular.json'} scale={[1, 1, 0.2]} curveSegments={32} >
                        {text}
                    </Text3D>
                </Center>
            </group>
        </>
    )
}