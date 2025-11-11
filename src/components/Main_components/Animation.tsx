import React from 'react';
import * as THREE from 'three';

import { DisplayPage } from '../../components/DisplayPage';
import { useGlobalStore } from '../../stores/useGlobalStore';
import { AnimContent } from '../../components/Content_components/Animation/AnimContent';

/*
    This component is activated in App when the 'Animation' item is clicked in the menu.
*/

interface AnimProps {
    category_names?: string[]
    menu_positions?: THREE.Vector3[]
}

export const Animation: React.FC<AnimProps> = ({
    category_names = ['Contact', 'Animation', 'Computers', 'Art'],
    menu_positions = [new THREE.Vector3(0,0,0)]
}) => {
    const { pages } = useGlobalStore((state) => state);
    const global_anim = useGlobalStore((state) => state.global_anim);

    return (
        <>
            {pages[2].active ?
                <>
                    <group visible={pages[2].visible}>
                        {global_anim ?
                            null :    
                            <DisplayPage
                                menu_items={[
                                    'Home',
                                    category_names[0],
                                    category_names[2],
                                    category_names[3]
                                ]}
                                position={menu_positions}
                            />
                        }
                        <AnimContent />
                        <pointLight position={[2,2,-3]} intensity={15} />
                        <pointLight position={[-2,2,-3]} intensity={15} />
                    </group>
                </>
                : null
            }
        </>
    )
}