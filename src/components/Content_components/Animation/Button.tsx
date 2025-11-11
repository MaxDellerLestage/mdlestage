import { a, useSpring } from '@react-spring/three';
import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useVidStore } from '../../../stores/useVidStore';
import { useSvgStore } from '../../../stores/useSvgStore';

/*
    This component is used exclusively in src/components/Content_components/Animation/AnimContent.
    It populates the function buttons for the video player and contains all animation logic for hovers and actions.
*/

interface ButtonProps {
    buttonType: string;
}

export const Button: React.FC<ButtonProps> = ({
    buttonType = 'play'
}) => {
    const [pressed, setPressed] = useState(false);
    const [hover, setHover] = useState(false);
    const [muted, setMute] = useState(true);
    const { video } = useVidStore((state) => state);
    const { getSVG } = useSvgStore((state) => state);

    const button_height = -1.25;
    const button_depth = -3;
    const button_scale = 0.01;

    // Hover transforms cursor style
    useEffect(() => {
        document.body.style.cursor = hover ? 'pointer' : 'default';
    }, [hover]);

    // Animation for pressing buttons, slightly scales down button
    const { scale } = useSpring({
        scale: pressed ? 0.9*button_scale : button_scale,
        config: {mass: 1, tension: 300, friction: 10, bounce: 0.2}
    });

     function playButton() {
        if (video) {
            video.play();
        }
    }

    function pauseButton() {
        if (video) {
            video.pause();
        }
    }

    function rewButton() {
        if (video) {
            video.currentTime -= 1/24;
        }
    }

    function ffButton() {
        if (video) {
            video.currentTime += 1/24;
        }
    }

    function startButton() {
        if (video) {
            video.currentTime = 0;
        }
    }

    function muteButton() {
        if (video) {
            if (video.muted == true) {
                video.muted = false;
                setMute(false);
            }
            else if (video.muted == false) {
                video.muted = true;
                setMute(true);
            }
        }
    }

    /* 
        This switch exists in order to have only one mesh component at the end of the return statement 
        which contains all of the event logic
    */
    function masterButton() {
        switch(buttonType) {
            case 'play':
                playButton()
                break;
            case 'pause':
                pauseButton()
                break;
            case 'rewind':
                rewButton()
                break;
            case 'ff':
                ffButton()
                break;
            case 'restart':
                startButton()
                break;
            case 'mute':
                muteButton()
                break;
        }
    }

    // Transform audio icon when toggled
    let buttonGroup = getSVG(buttonType);
    if (!muted && buttonType == 'mute') {
        buttonGroup = getSVG('unmute');
    }

    // Bounding box setup for buttons
    const buttonRef = useRef(null);
    const [boundingBox, setBoundingBox] = useState<{size: THREE.Vector3, center: THREE.Vector3} | null>(null);

    useEffect(() => {
        if (buttonRef.current) {
            const box = new THREE.Box3().setFromObject(buttonRef.current);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();

            box.getSize(size);
            box.getCenter(center);
            setBoundingBox({size, center});
        }
    }, [buttonRef]);

    return (
        <>
        {buttonType == 'play' ?
            <a.group
                ref={buttonRef}
                position={[0.15,button_height,button_depth]}
                scale={scale}
            >
                {buttonGroup && <primitive object={buttonGroup} />}
            </a.group>
            : null
        }
        {buttonType == 'pause' ?
            <a.group
                ref={buttonRef}
                position={[-0.15,button_height,button_depth]}
                scale={scale}
            >
                {buttonGroup && <primitive object={buttonGroup} />}
            </a.group>
            : null
        }
        {buttonType == 'rewind' ?
            <a.group
                ref={buttonRef}
                position={[-0.7,button_height,button_depth]}
                scale={scale}
            >
                {buttonGroup && <primitive object={buttonGroup} />}
            </a.group>
            : null
        }
        {buttonType == 'ff' ?
            <a.group
                ref={buttonRef}
                position={[0.7,button_height,button_depth]}
                scale={scale}
            >
                {buttonGroup && <primitive object={buttonGroup} />}
            </a.group>
            : null
        }
        {buttonType == 'restart' ?
            <a.group
                ref={buttonRef}
                position={[-1.3,button_height,button_depth]}
                scale={scale}
            >
                {buttonGroup && <primitive object={buttonGroup} />}
            </a.group>
            : null
        }
        {buttonType == 'mute' ?
            <a.group
                ref={buttonRef}
                position={[1.25,button_height,button_depth]}
                scale={scale}
            >
                {buttonGroup && <primitive object={buttonGroup} />}
            </a.group>
            : null
        }
        {boundingBox && (
            <mesh
                onClick={masterButton}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
                onPointerLeave={() => setPressed(false)}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                position={boundingBox.center}
                visible={false}
            >
                <boxGeometry args={[boundingBox.size.x, boundingBox.size.y, boundingBox.size.z]} />
                <meshBasicMaterial transparent opacity={1} />
            </mesh>
        )}
        </>
    )
}