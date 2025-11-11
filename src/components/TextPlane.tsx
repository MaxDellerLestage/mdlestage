import { useMemo } from 'react';
import { useGlobalStore } from '../stores/useGlobalStore';
import * as THREE from 'three';
import { useSpring, a, easings } from '@react-spring/three';

/*
    This component is used whenever plain text is necessary.
*/

export function TextPlane({ text="Placeholder" }) {

    const reverse_anim = useGlobalStore((state) => state.reverse_anim);
    const global_anim = useGlobalStore((state) => state.global_anim);

    const triggerAnim = useSpring({
        position: !reverse_anim && !global_anim
        ? [-1.1,-1,-4]
        : [-10,0,0],
        scale: !reverse_anim && ! global_anim
        ? 1.2
        : 0.0,
        config: { duration: 100, easing: easings.easeOutCubic}
    })

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        const size = 2096;
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx!.fillStyle = '#000000ff'
        ctx!.fillRect(0,0,size,size);

        ctx!.fillStyle = 'white';
        ctx!.font = '48px sans-serif';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'top';

        const lines = text.split('\n');
        lines.forEach((line, i) => {
            ctx!.fillText(line, size/2, 50+i*50);
        })

        const texture = new THREE.CanvasTexture(canvas);
        
        return texture;

    }, [text]);

    return (
        <a.mesh
            position={(triggerAnim.position) as unknown as [number,number,number]}
            rotation={[0,Math.PI*0.2,0]}
            scale={triggerAnim.scale}
        >
            <planeGeometry args={[3,3]} />
            <meshBasicMaterial map={texture} />
        </a.mesh>
    )
}