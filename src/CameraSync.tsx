import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { useGlobalStore } from './stores/useGlobalStore'

/*
    CameraSync function ensures camera position corresponds 
    to active state whenever current path is refreshed or linked to externally.
    This component is activate in the main Canvas level in the App component. 
*/

export function CameraSync() {
    
    const { camera } = useThree();
    const location = useLocation();
    const { global_anim, reverse_anim } = useGlobalStore((state) => state)
    const path = location.pathname.replace('/', '') || 'home';

    useEffect(() => {
        if (path == 'home' && !reverse_anim && !global_anim) {
            camera.position.set(0,0,10);
            camera.lookAt(0,0,-2);
        }
        else if (path != 'home' && !global_anim && !reverse_anim) {
            camera.position.set(0,0,-1);
            camera.lookAt(0,0,-2);
        }
    }, [path, camera])

    return null;
}