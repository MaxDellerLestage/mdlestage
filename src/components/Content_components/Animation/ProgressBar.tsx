import { useRef, useState } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useVidStore } from '../../../stores/useVidStore';

/*
    This components is used exclusively in src/components/Content_components/Animation/AnimContent.
    It creates an interactive progress bar at the bottom of the VidDisplay.
*/

export function ProgressBar({width=1.6, height=0.03}) {

    const { viewport } = useThree((state) => state);
    const progressRef = useRef<THREE.Mesh | null>(null);
    const { video } = useVidStore((state) => state);
    const [hoverTime, setHoverTime] = useState(-1);
    const [hoverX, setHoverX] = useState(0);

    const opacity = 0.7;


    // Track video progress and fill progress bar
    useFrame(() => {
        if (video && progressRef.current) {
            const progress = video.currentTime/video.duration;
            progressRef.current.scale.x = progress;
            progressRef.current.position.x = -width/2 + (width*progress)/2;
        }
    });

    // Click event goes to corresponding time in video
    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        if (video) {
            const localX = e.point.x;
            const relativeX = localX + width/2;
            const percent = Math.min(Math.max(relativeX/width, 0), 1);
            video.currentTime = percent*video.duration;
        }
    }


    // Hover event shows timestamp corresponding to position on progress bar
    const handleHover = (e: ThreeEvent<MouseEvent>) => {
        if (video) {
            const localX = e.point.x;
            const relativeX = localX + width/2;
            const percent = Math.min(Math.max(relativeX/width, 0), 1);
            const time = percent*video.duration;

            setHoverTime(time);
            setHoverX(localX);
        }
    }

    // Move event updates timestamp corresponding to position on progress bar
    const handleMove = (e: ThreeEvent<MouseEvent>) => {
        if (video && hoverTime != -1) {
            const localX = e.point.x;
            const relativeX = localX + width/2;
            const percent = Math.min(Math.max(relativeX/width, 0), 1);
            const time = percent*video.duration;

            setHoverTime(time);
            setHoverX(localX);
        }
    }

    const handleHoverOut = () => {
        setHoverTime(-1);
    }

    // Format display time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds/60);
        const secs = Math.floor(seconds%60);
        return `${mins}:${secs.toString().padStart(2,'0')}`;
    }


    return (
        <>
            <group position={[0,-0.437,-2]} >
                <mesh 
                    position={[0,0,0]} 
                    onClick={handleClick}  
                    onPointerOver={handleHover}
                    onPointerOut={handleHoverOut}
                    onPointerMove={handleMove}                             
                >
                    <planeGeometry args={[width,height]} />
                    <meshBasicMaterial color={new THREE.Color(0.2,0.2,0.2)} opacity={opacity} transparent />
                </mesh>
                <mesh ref={progressRef} position={[-width/2,0,0]}>
                    <planeGeometry args={[width,height]} />
                    <meshBasicMaterial color={new THREE.Color(0.2,0.2,1.0)} opacity={opacity} transparent />
                </mesh>
            </group>
            {hoverTime !== -1 ?
                <Center onCentered={({container, height}) => container.scale.setScalar((viewport.height/height)*0.01)} position={[hoverX, -0.41, -2]}>
                    <Text3D font={'/fonts/Ethnocentric_Regular.json'} scale={[1,1,0.2]} curveSegments={32}>
                        {formatTime(hoverTime)}
                    </Text3D>
                </Center>
                : null
            }
        </>
    )
}