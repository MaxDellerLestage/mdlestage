import React from 'react';
import * as THREE from 'three';
import { VidDisplay } from './VidDisplay';
import { useVidStore } from '../../../stores/useVidStore';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import { useSpring, a, easings } from '@react-spring/three'; 

import { Loading } from '../../Loading';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';

/*
    This component is the parent component for all video player related components
    which are displayed in the /animation path.
*/

interface AnimProps {
    imgSize?: number;
}

export const AnimContent: React.FC<AnimProps> = ({
    imgSize = 0.005
}) => {
    const reverse_anim = useGlobalStore((state) => state.reverse_anim);
    const { video } = useVidStore((state) => state);


    // Scale down animation component when 'Home' is clicked in the menu.
    const triggerAnim = useSpring({
        scale: !reverse_anim
        ? 1.0
        : 0.0,
        config: { duration: 1000, easings: easings.easeInCubic}
    });

    return (
        <>
            <a.group
                scale={triggerAnim.scale}
            >
                {video ?
                    <VidDisplay
                        height={video.videoHeight*imgSize}
                        width={video.videoWidth*imgSize}
                        position={ new THREE.Vector3(0,0,-7) }
                        rotation={ new THREE.Euler(0,0,0) }
                    /> 
                    : <Loading position={ new THREE.Vector3(0,0,-4) } />
                }
                <Button buttonType={'play'} />
                <Button buttonType={'pause'} />
                <Button buttonType={'rewind'} />
                <Button buttonType={'ff'} />
                <Button buttonType={'restart'} />
                <Button buttonType={'mute'} />
                <ProgressBar />
            </a.group>
        </>
    )

}