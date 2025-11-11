import React from 'react';
import * as THREE from 'three';

import { DisplayPage } from '../DisplayPage';
import { useGlobalStore } from '../../stores/useGlobalStore';

/*
    This component is activated in App when 'Contact' is clicked in the menu.
    I have added extra menu items and position data for the external links to 
    LinkedIn, Github, and Email (the email link just copies the email to clipboard)
*/

interface ContactProps {
    category_names?: string[]
    menu_positions?: THREE.Vector3[]
    menu_scale?: number
}

export const Contact: React.FC<ContactProps> = ({
    category_names = ['Contact', 'Animation', 'Computers', 'Art'],
    menu_positions = [new THREE.Vector3(0,0,0)],
    menu_scale = 1.0
}) => {
    const { pages } = useGlobalStore((state) => state);
    const global_anim = useGlobalStore((state) => state.global_anim);

    const link_positions = [
        ...menu_positions,
        new THREE.Vector3(0, 0.3, -3),
        new THREE.Vector3(0, 0, -3),
        new THREE.Vector3(0, -0.3, -3)
    ]

    return (
        <>
            <>
            {pages[1].active ?
                <group visible={pages[1].visible}>
                    {global_anim ?
                        null :    
                        <DisplayPage
                            menu_items={[
                                'Home',
                                category_names[1],
                                category_names[2],
                                category_names[3],
                                'Email',
                                'LinkedIn',
                                'Github'
                            ]}
                            position={link_positions}
                        />
                        }
                </group>
                : null
            }
            </>
        </>
    )
}