import { create } from 'zustand';
import * as THREE from 'three';

/*
    The Vid store loads and formats a video file for use in AnimContent.
*/

interface VidData {
    vidList: THREE.VideoTexture | null
    video: HTMLVideoElement | null
    vidLoaded: boolean
    isPlaying: boolean
    setIsPlaying: (value: boolean) => void
    setVidLoaded: (value: boolean) => void
    initVid: (url: string) => void
}


export const useVidStore = create<VidData>((set, get) => ({
    vidList: null,
    video: null,
    vidLoaded: false,
    isPlaying: true,
    setIsPlaying: (value: boolean) => set({isPlaying: value}),
    setVidLoaded: (value: boolean) => set({ vidLoaded: value }),
    initVid: (url: string) => {

        if (get().video) return;

        const vid = document.createElement('video');
        vid.src = url;
        vid.crossOrigin = 'anonymous';
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.play();

        const tex = new THREE.VideoTexture(vid);
        tex.format = THREE.RGBFormat

        set({video: vid, vidList: tex});
    }
    }
));