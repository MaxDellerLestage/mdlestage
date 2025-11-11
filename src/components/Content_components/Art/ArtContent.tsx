import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { a, useSpring, easings } from '@react-spring/three';
import { ImgDisplay } from './ImgDisplay';
import { useTexStore } from '../../../stores/useTexStore';
import { useImgStore } from '../../../stores/useImgStore';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import { Loading } from '../../../components/Loading';

/*
    This component is the parent component for the individual ImgDisplay components
    which are displayed in the /art path.
*/

interface ArtProps {
    imgSize?: number;
}

export const ArtContent: React.FC<ArtProps> = ({
    imgSize = 0.00027
}) => {
    const reverse_anim = useGlobalStore((state) => state.reverse_anim);
    const global_anim = useGlobalStore((state) => state.global_anim);

    const lightRef = useRef<THREE.PointLight | null>(null);
    const { isActive } = useImgStore((state) => state)
    const { texList } = useTexStore((state) => state);
    const { texLoaded } = useTexStore((state) => state);

    const spread = 3.5;
    const depth = -4.5;

    const sizeList = [
        2, 2.8,
        3.2, 2.6,
        2.7, 2.5,
        3.2, 3.0
    ];

    // This useEffect switches the lighting whenever an image is selected or deselected
    useEffect(() => {
        if (isActive != -1 && lightRef.current) {
            lightRef.current.visible = false
        }
        else if (isActive == -1 && lightRef.current) {
            lightRef.current.visible = true
        }
    }, [isActive]);

    // Enter and exit animation
    const triggerScale = useSpring({
        
        scale: !reverse_anim && !global_anim
        ? 1.0
        : 0.6,
        config: { duration: 500, easing: easings.easeInCubic},

    }); 
    
    if (!texLoaded) {
        return (
            <Loading 
                position={new THREE.Vector3(0,0,-6)}
            />
        )
    }
    
    return (
        <a.group
            scale={triggerScale.scale}
        >
            <>
                {texList.map((tex, i) => 
                    {
                        const index = i;
                        const orientation = (index+1) > texList.length/2 ? 1 : -1;
                        
                        return (
                            <>
                                {tex.texture.image != null ?
                                    
                                    <ImgDisplay
                                    width={tex.texture.image.width*imgSize*sizeList[index]}
                                    height={tex.texture.image.height*imgSize*sizeList[index]}
                                    orientation={orientation}
                                    position={new THREE.Vector3(
                                        Math.cos(Math.PI*((i)/7))*spread,
                                        Math.sin(Math.PI*(i/7))*3,
                                    (-Math.sin(Math.PI*((i)/7))*spread)+depth
                                    )}
                                    rotation={ new THREE.Euler(0,0,0) }
                                    index={index}
                                    depth={depth}
                                    colorMap={tex.texture}
                                    key={tex.id}
                                    />
                                    : <Loading 
                                            position={new THREE.Vector3(
                                                Math.cos(Math.PI*((i)/7))*spread,
                                                Math.sin(Math.PI*(i/7))*3,
                                                (-Math.sin(Math.PI*((i)/7))*spread)+depth
                                            )}
                                        />
                                }
                            </>
                        )
                    }
                )}
                <pointLight ref={lightRef} position={[0,0,depth]} intensity={60} color={[1.0, 0.7, 0.9]} />
            </>
        </a.group>
    )

}