import { Category } from './Category';
import { useGlobalStore } from '../stores/useGlobalStore'
import * as THREE from 'three';

/*
    This component is the parent for the Category components. Each routing path renders this component
    with altered props to populate the correct menu items and positions.
*/

interface DisplayProps {
    menu_items: string[];
    position: THREE.Vector3[];
}

export const DisplayPage: React.FC<DisplayProps> = ({
    menu_items = [],
    position = [new THREE.Vector3()]
}) => {

    const { pages } = useGlobalStore((state) => state);

    return (
        <>
            {menu_items.map((item: string, i: number) => 
                <Category 
                    name={item} 
                    pos={position[i]}
                    index={i}
                    key={pages[i].id}
                />
            )}
        </>
    );
};