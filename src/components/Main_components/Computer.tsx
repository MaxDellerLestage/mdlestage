import React from 'react';
import * as THREE from 'three';

import { DisplayPage } from '../../components/DisplayPage';
import { useGlobalStore } from '../../stores/useGlobalStore';
import { CompContent } from '../../components/Content_components/Computers/CompContent';

/*
    This component is activated in App when the 'Computers' item is clicked in the menu.
*/

interface CompProps {
    category_names?: string[]
    menu_positions?: THREE.Vector3[]
}

export const Computer: React.FC<CompProps> = ({
    category_names = ['Contact', 'Animation', 'Computers', 'Art'],
    menu_positions = [new THREE.Vector3(0,0,0)]
}) => {
    const { pages } = useGlobalStore((state) => state);
    const global_anim = useGlobalStore((state) => state.global_anim);

    return (
        <>
            {pages[3].active ?
                <>
                    <group visible={pages[3].visible}>
                        {global_anim ?
                            null :    
                            <DisplayPage
                            menu_items={[
                                'Home',
                                category_names[0],
                                category_names[1],
                                category_names[3]
                            ]}
                            position={menu_positions}
                            />
                        }
                        <CompContent />
                    </group>
                </>
            : null
            }
        </>
    )
}