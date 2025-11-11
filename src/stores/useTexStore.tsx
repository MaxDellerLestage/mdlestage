import { create } from 'zustand';
import * as THREE from 'three';

/*
    The Tex store loads and stores image data for use in the ArtContent component.
*/

interface TexData {
    texList: {texture: THREE.Texture, id: number}[]
    texLoaded: boolean
    setTexLoaded: (value: boolean) => void
    loadTex: (url: string, index: number) => void
}

export const useTexStore = create<TexData>((set) => ({
    texList: [],
    texLoaded: false,
    setTexLoaded: (value: boolean) => set({ texLoaded: value }),
    loadTex: async(url: string, index: number) => {

        const loader = new THREE.TextureLoader();

        try {

            const tex = await loader.loadAsync(url);

            set((state) => {
                
                if (state.texList.find((t) => t.id === index)) return state;

                const newList = [...state.texList, {texture: tex, id: index}].sort((a,b) => a.id - b.id);
                const allLoaded = newList.length >= 8 && newList.every(t=>t.texture.image);
                
                return {
                    texList: newList,
                    texLoaded: allLoaded
                }
            });
        } catch (err) {
            console.error("Texture load failed", err);
        };
    }
        
    }
));

