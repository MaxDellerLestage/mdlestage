import React from 'react';
import * as THREE from 'three';

import { DisplayPage } from '../../components/DisplayPage';
import { useGlobalStore } from '../../stores/useGlobalStore';
import { ArtContent } from '../../components/Content_components/Art/ArtContent';

/*
    This component is activated in App when the 'Art' item is clicked in the menu.
*/

interface ArtProps {
    category_names?: string[]
    menu_positions?: THREE.Vector3[]
}

export const Art: React.FC<ArtProps> = ({
    category_names = ['Contact', 'Animation', 'Computers', 'Art'],
    menu_positions = [new THREE.Vector3(0,0,0)]
}) => {
    const pages = useGlobalStore((state) => state.pages);
    const global_anim = useGlobalStore((state) => state.global_anim);

    return (
        <>
            {pages[4].active ?
                <>
                    <group visible={pages[4].visible}>
                        {global_anim ?
                            null :    
                            <DisplayPage
                                menu_items={[
                                    'Home',
                                    category_names[0],
                                    category_names[1],
                                    category_names[2]
                                ]}
                                position={menu_positions}
                            />
                        } 
                        <ArtContent />
                    </group>
                </>
                : null
            }
        </>
    )
}