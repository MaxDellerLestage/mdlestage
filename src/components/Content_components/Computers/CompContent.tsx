import React from 'react';
import { TextPlane } from '../../TextPlane';
import { Water } from '../../Water';
import Geometries from '../../Lighting_test';
import * as THREE from 'three';
import { useSpring, a, easings } from '@react-spring/three';
import { useGlobalStore } from '../../../stores/useGlobalStore';

/*
    This component is displayed in the /computers path.
    It reuses the Lighting_test component for the refract effect and combines with the Water component.
    I will be adding more content to this page.
*/

interface CompProps {
    text?: string
}

export const CompContent: React.FC<CompProps> = ({
    text = "It's a me, a computer programmer!"
}) => {

    const {current_page} = useGlobalStore((state) => state)
    const reverse_anim = useGlobalStore((state) => state.reverse_anim);
    // Enter and exit animation
    const triggerAnim = useSpring({
        scale: !reverse_anim && current_page != 'Home'
        ? 1.0
        : 0.0,
        config: { duration: 1000, easing: easings.easeInCubic}
    })

    return (
        <>
            <TextPlane 
                text={
                    'Coming Soon'
                }
            />
            <a.group
                scale={triggerAnim.scale}
            >
                <Water
                    water_res={159}
                    size={0.4}

                    color_1={new THREE.Color(0.7,0.2,0.1)}
                    color_2={new THREE.Color(0.1,0.8,0.7)}
                    position={new THREE.Vector3(0,0,-5)}
                    light_count={2}
                    color_mult={0.5}
                    amp_mult={1.2}

                    loop_time={100.0}

                    noise = {
                    {scale: 0.7,
                    f_value: 0.0,
                    f_amp: 0.7,
                    f_freq: 1.8,
                    octaves: 4,
                    gain: 2.0,
                    offset: 1.0}
                    }

                    mask = {
                    {scale: 0.9,
                    value: 0.0,
                    amp: 0.3,
                    freq: 1.5,
                    octaves: 8,
                    gain: 2.0,
                    offset: 1.0,}
                    }

                    wave_num={1}
                    waves = {
                        {amp: [0.06],
                        freq: [2.0],
                        speed: [2.0],
                        start: [-99.0],
                        end: [99.0],
                        falloff: [6.0],
                        tilt: [0.3],
                        pitch: [0.05],
                        yaw: [0.0],
                        tilt_speed: [1.0],
                        pitch_speed: [1.0],
                        yaw_speed: [0.0],
                        bias_start: [-3.0],
                        bias_end: [3.0],
                        bias_power: [0.1]}
                    }
                    
                    ao_intensity={0.1}
                    ao_range={0.4}
                />
                <Geometries 
                    position={new THREE.Vector3(0,0,-4.5)}
                    size={0.9}
                    saturation={1.03}
                    chrom_ab={0.2}
                    refraction={4.1}
                />
            </a.group>
        </>
    )
  
            
}



                