import { useEffect } from 'react';
import { useTexStore } from '../stores/useTexStore';
import { useVidStore } from '../stores/useVidStore';
import { useSvgStore } from '../stores/useSvgStore';

/*
    This function is responsible for loading images, SVGs, and video files concurrently on page load.
*/


export function TexPreload({num_images=8}) {
    const loadTex = useTexStore((state) => state.loadTex);
    const setTexLoaded = useTexStore((state) => state.setTexLoaded);
    const texList = useTexStore((state) => state.texList);
    const loadSVG = useSvgStore((state) => state.loadSVG);
    const { initVid } = useVidStore((state) => state);

    useEffect(() => {
        initVid('/assets/videos/vid_0.mp4');
    }, [initVid]);

    useEffect(() => {
    
        function loadAll() {

            for (let i=0; i<num_images; i++) {
                loadTex(`/assets/pictures/img_${i}.png`, i);
            }
        }
        if (texList.length>=num_images) return;
        loadAll();
        
    }, [setTexLoaded, loadTex, num_images, texList]);

    // Creates a short buffer period so that all images do not start loading at the same time, 
    // as this was causing performance issues.
    useEffect(() => {
        const interval = setInterval(() => {
            if (texList.length >= num_images) {
                setTexLoaded(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [setTexLoaded, texList, num_images]);

    useEffect(() => {

        const svgs = [
        'close',
        'ff',
        'mute',
        'pause',
        'play',
        'restart',
        'rewind',
        'unmute'
        ];

        for (let i=0; i<svgs.length; i++) {
            loadSVG(`assets/icons/${svgs[i]}.svg`, svgs[i]);
        }
    }, [loadSVG]);

    return null;
}