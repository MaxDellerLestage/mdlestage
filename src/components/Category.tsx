import React from 'react';
import * as THREE from 'three';
import { a, useSpring, easings } from '@react-spring/three';
import { Text3D, Center } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useGlobalStore } from '../stores/useGlobalStore';
import { useModelStore } from '../stores/useModelStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Nebula } from './New_neb';

/*
    This component controls the menu items on each page. It contains all
    animation, hover, and click logic for page transitions. Most of the important
    state changes originate here. There is one Category component for each menu item,
    and they are all children of the DisplayPage component. It also reuses the Nebula component
    for the line animation for the hover event.
*/

interface CategoryProps {
    name?: string;
    pos?: THREE.Vector3;
    index?: number;
}

export const Category: React.FC<CategoryProps> = ({
    name = 'Default',
    pos = new THREE.Vector3(0,0,0),
    index=0
}) => {

    const { pages, current_page, global_anim, reverse_anim, setPage, setVisible, setCurrentPage, setPrevPage, setGlobalAnim, setReverseAnim, setReverseFirst } = useGlobalStore((state) => state);
    const { setActiveRes } = useModelStore((state) => state);
    const [hover, setHover] = useState(false);
    const [enter, setEnter] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const user = 'dellerlestage';
    const domain = 'hotmail.com';

    // Change cursor on hover event
    useEffect(() => {
        document.body.style.cursor = hover ? 'pointer' : 'default';
    }, [hover]);

    const baseScale = 0.04;

    // Click event handler
    function button() {

        // The first group of click events are for external links and copying email to clipboard

        if (name=='LinkedIn') {
            window.open("https://www.linkedin.com/in/max-deller-lestage/", "_blank", "noopener, noreferrer");
            return;
        }
        else if (name=='Github') {
            window.open("https://github.com/MaxDellerLestage", "_blank", "noopener, noreferrer");
            return;
        }
        else if (name=='Email') {
            try {
                const email = `${user}@${domain}`;
                navigator.clipboard.writeText(email);
                alert(`Email copied to clipboard: ${email}`);
            } catch (err) {
                console.error("Clipboard copy failed", err);
                alert("Failed to copy email to clipboard");
            }
        }
        else {

            setPrevPage(current_page);
            setCurrentPage(name);
            setActiveRes('low');

            if (current_page=='Home') {
                setVisible(name, true);
                setPage(name, true);
                setGlobalAnim(true);
            }
            else if (name == 'Home') {
                setReverseAnim(true);
                setReverseFirst(true);
            }
            else {
                for (let i=0; i<5; i++) {
                    if (pages[i].page_name != name) {
                        setVisible(pages[i].page_name, false);
                        setPage(pages[i].page_name, false);
                    }
                }
                setPage(name, true);
                setVisible(name, true);
                navigate(`/${name.toLowerCase()}`);
            }
        }
    }

    // Bounding box for menu item
    const textRef = useRef(null);
    const [boundingBox, setBoundingBox] = useState<{size: THREE.Vector3, center: THREE.Vector3} | null>(null);

    useEffect(() => {
        if (textRef.current) {

            const box = new THREE.Box3().setFromObject(textRef.current);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();

            box.getSize(size);
            box.getCenter(center);
            setBoundingBox({size, center});

        }
    }, [name]);

    const path = location.pathname.replace('/', '') || 'home';
    const isActive = path == 'home';

    // Position for line animation for hover event
    const line_pos = new THREE.Vector3(
        pos.x,
        current_page == 'Home' ? pos.y -0.3 : pos.y - 0.06,
        pos.z
    );
    
    // Various transition animations
    const { scaleX } = useSpring({
        from: {
            scaleX: 0
        },
        to: { 
            scaleX: 1.0*(isActive ? baseScale*10.0 : baseScale*2.0) 
        },
        config: {duration: 550, easing: easings.easeOutCubic},
        delay: 100*index
    });

    const { scaleY } = useSpring({
        from: {
            scaleY: 0
        },
        to: {
            scaleY: 1.0*(isActive ? baseScale*10.0 : baseScale*2.0) 
        },
        config: {duration: 1500, easing: easings.easeOutCubic},
        delay: 100*index
    });
    
    const { opacity } = useSpring({
        from: {
            opacity: 0
        },
        to: {
            opacity: 1.0
        },
        config: {mass: 1, tension: 400, friction: 200, bounce: 2.0},
        delay: 100*index
    });

    const enterPos = useSpring({
        from: {
            position: [0,0,0]
        },
        to: async (next) => {
            await next({ position: [pos.x, pos.y, pos.z] });
            setEnter(true);
        },
        config: { mass: 1, tension: 100, friction: 40, bounce: 0.1},
        delay: 200*index
    });

    const triggerPos = useSpring({
        position: global_anim || reverse_anim
        ? [0,0,-3]
        : [pos.x,pos.y,pos.z],
        scaleX: global_anim || reverse_anim
        ? 0
        : scaleX,
        scaleY: global_anim || reverse_anim
        ? 0
        : scaleY,
        config: { duration: 1000, easing: easings.easeInCubic},
        delay: 300*index,
        immediate: !enter
    });

    return (
        <>  
        <a.group
            position={(global_anim || reverse_anim ? triggerPos.position : enterPos.position) as unknown as [number,number,number]}
            scale-x={global_anim || reverse_anim ? triggerPos.scaleX : scaleX}
            scale-y={global_anim || reverse_anim ? triggerPos.scaleY : scaleY}
            scale-z={isActive ? baseScale*10.0 : baseScale*2.0}
        >
            <Center>
                <a.mesh>
                    <Text3D ref={textRef} font={'/fonts/Ethnocentric_Regular.json'} scale={[1, 1, 0.2]} curveSegments={32} >
                        {name}
                        <a.meshBasicMaterial 
                            opacity={opacity}
                            transparent
                        />
                    </Text3D>
                </a.mesh>
                {boundingBox && (
                    <mesh 
                        onClick={button}
                        onPointerOver={() => {
                            setHover(true)
                        }}
                        onPointerOut={() => {
                            setHover(false)
                        }}
                        position={boundingBox.center}
                        visible={false}
                    >
                        <boxGeometry args={[boundingBox.size.x, boundingBox.size.y, boundingBox.size.z]} />
                        <meshBasicMaterial transparent opacity={1} />
                    </mesh>
                )}
            </Center>
        </a.group>
        <group
            visible={hover && !global_anim && !reverse_anim}
        >
            <Nebula 
                count={62}
                neb_number={3}
                position={line_pos}
                rot_anim={0}
                rotation={[0,0,0]}
                line_length={current_page == 'Home' ? 15.0 : 3.0}
                line_speed={2.0}
            />
        </group>
        </>
    );
}