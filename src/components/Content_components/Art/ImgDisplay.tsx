import { useFrame } from '@react-three/fiber';
import { useImgStore } from '../../../stores/useImgStore';
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useSvgStore } from '../../../stores/useSvgStore';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import { a, useSpring } from '@react-spring/three';

/*
    This component is used as a container for the individual images and is a child of the ArtContent component.
    It includes all hover and click logic for the image.
*/

interface ImgProps {
    height?: number;
    width?: number;
    orientation?: number;
    index?: number;
    depth?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    colorMap?: THREE.Texture;
}

export const ImgDisplay: React.FC<ImgProps> = ({
    height = 2,
    width = 2,
    orientation = 1,
    index = 0,
    depth = 0,
    position = new THREE.Vector3(0,0,0),
    rotation = new THREE.Euler(0,0,0),
    colorMap = new THREE.Texture
}) => {

    const [pressed, setPressed] = useState(false);
    const [hover, setHover] = useState(false);
    const [button, setButton] = useState(false);
    const { getSVG } = useSvgStore((state) => state);
    const { pages } = useGlobalStore((state) => state);

    const button_height = 0.9;
    const button_depth = -3;
    const button_scale = 0.01;

    // Change cursor when hovering over image
    useEffect(() => {
        document.body.style.cursor = hover ? 'pointer' : 'default';
    }, [hover]);

    // Animation for the "close" button
    const { scale } = useSpring({
        scale: pressed ? 0.9*button_scale : button_scale,
        config: {mass: 1, tension: 300, friction: 10, bounce: 0.2}
    });

    const meshRef = useRef<THREE.Mesh | null>(null);
    const lightRef = useRef<THREE.PointLight | null>(null);

    const isAnim = useRef(false);
    const isAnimOff = useRef(false);
    const isClicked = useRef(false);
    const hoverOff = useRef(false);
    const isSmall = useRef(true);
    const isBig = useRef(false);

    const { isActive, setActive } = useImgStore((state) => state);

    const init_width = useMemo(() => width, [width]);
    const init_height = useMemo(() => height, [height]);
    const set_width = useMemo(() => init_width*1.2, [init_width]);
    const rot_adj = (Math.pow(Math.cos(Math.PI*(index/7)),64)*orientation)*0.6;

    const anim_speed = 0.06;
    const increment = init_width*anim_speed;

    const zoom_size = 1.8;

    // This sets the initial orientation for the image on page load.
    useLayoutEffect(() => {
        if (meshRef.current) {
            meshRef.current.lookAt(new THREE.Vector3(0,0,depth));
            meshRef.current.rotation.z = rot_adj;
            setActive(-1);
        }
    }, [pages]);

    // This ensures the image remains in the correct orientation when another image is selected.
    useEffect(() => {
        if (meshRef.current && isActive !== index) {
            meshRef.current.lookAt(new THREE.Vector3(0,0,depth));
            meshRef.current.rotation.z = rot_adj;
        }
    }, [depth, rot_adj, isActive, index]);

    function onImgHover() {
        isAnim.current = true;
        isAnimOff.current = false;
    }

    function onImgLeave() {
        isAnimOff.current = true;
        isAnim.current = false;
    }

    function onImgClick() {
        if (isActive == -1) {
            setActive(index);
            isClicked.current = true;
        }
    }

    function closeButton() {
        setActive(-1);
        isClicked.current = true;
    }

    // Hover on animation

    useFrame(() => {
        if (meshRef.current) {
            if (isAnim.current && !isAnimOff.current && meshRef.current.scale.x < set_width && isActive == -1) {
                document.body.style.cursor = 'pointer';
                meshRef.current.scale.x += increment;
                meshRef.current.scale.y += increment;
            }
            if (meshRef.current.scale.x >= set_width || isAnimOff.current) {
                isAnim.current = false;
            }
        }
    });

    // Hover off animation

    useFrame(() => {
        if (meshRef.current) {
            if (isAnimOff.current && !isAnim.current && meshRef.current.scale.x > init_width && isActive == -1) {
                document.body.style.cursor = 'default';
                meshRef.current.scale.x -= increment;
                meshRef.current.scale.y -= increment;
            }
            if (meshRef.current.scale.x <= init_width || isAnim.current) {
                isAnimOff.current = false;
            }
        }
    });

    // Center and enhance image

    useFrame(() => {
        if (meshRef.current && lightRef.current) {
            if (isClicked.current==true && isSmall.current==true && isActive == index) {
                lightRef.current.visible = true;
                meshRef.current.rotation.z = 0;
                meshRef.current.position.x = 0;
                meshRef.current.position.y = 0;
                meshRef.current.position.z = depth+1;
                meshRef.current.scale.x = init_width*zoom_size;
                meshRef.current.scale.y = init_height*zoom_size;
                meshRef.current.lookAt(new THREE.Vector3(0,0,0));
                document.body.style.cursor = 'default';
                isClicked.current = false;
                isSmall.current = false;
                isBig.current = true;
                hoverOff.current = true;
                setButton(true);
            } else if (isClicked.current==true && isBig.current==true) {
                lightRef.current.visible = false;
                meshRef.current.position.x = position.x;
                meshRef.current.position.y = position.y;
                meshRef.current.position.z = position.z;
                meshRef.current.scale.x = init_width;
                meshRef.current.scale.y = init_height;
                meshRef.current.lookAt(new THREE.Vector3(0,0,depth));
                meshRef.current.rotation.z = rot_adj;
                setButton(false);
                isClicked.current = false;
                isSmall.current = true;
                isBig.current = false;
                hoverOff.current = false;
            }
        }
    });

    // Bounding box for "close" button
    const buttonGroup = getSVG('close');
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
    }, [buttonRef, button, buttonGroup]);
    
    return (
        <>
            <a.mesh 
                ref={meshRef}
                position={position}
                scale={[width, height, 0.1]}
                onPointerOver={onImgHover}
                onPointerOut={onImgLeave}
                onClick={onImgClick}
                receiveShadow
                castShadow
            >
                <planeGeometry args={[1, 1]}   />
                <meshStandardMaterial map={colorMap} toneMapped={false} />
            </a.mesh>
            {button ? 
                <a.group
                    ref={buttonRef}
                    position={[1.7,button_height,button_depth]}
                    scale={scale}
                >
                    {buttonGroup && <primitive object={buttonGroup} />}
                </a.group>
                : null
            }
            {button && boundingBox && (
                <mesh
                    onClick={closeButton}
                    onPointerDown={() => setPressed(true)}
                    onPointerUp={() => setPressed(false)}
                    onPointerLeave={() => setPressed(false)}
                    onPointerOver={() => setHover(true)}
                    onPointerOut={() => setHover(false)}
                    position={boundingBox.center}
                    visible={false}
                >
                    <boxGeometry args={[boundingBox.size.x, boundingBox.size.y, boundingBox.size.z]} />
                    <meshBasicMaterial 
                        transparent 
                        opacity={0}
                        depthWrite={false}
                        depthTest={false}
                    />
                </mesh>
            )}
            <pointLight ref={lightRef} position={[0,0,0]} intensity={30} visible={false} />
        </>
    )
}