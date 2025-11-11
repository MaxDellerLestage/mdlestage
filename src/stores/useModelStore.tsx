import { create } from 'zustand';
import { getGLTFLoader } from '../functions/getGLTFLoader'

import * as THREE from 'three'

/*
    The Model store is used to preload various .glb model resolutions 
    and store the data for the Logo component to use when ready.

    It also contains flags which activate resolution changes based on the performance monitor,
    but this feature is disabled for now.
*/

type Model = {
    scene: THREE.Group<THREE.Object3DEventMap> | null
    nodes: Record<string, THREE.Object3D> | null
    materials: Record<string, THREE.Material> | null
}

type Models = {
    [key: string]: Model
}
interface ModelData {
    modelList: Models
    activeRes: string
    lowLoaded: boolean
    modelsLoaded: boolean
    setActiveRes: (res: string) => void
    setLowLoaded: (value: boolean) => void
    setModelsLoaded: (value: boolean) => void
    loadModel: (key: string, url: string) => Promise<void>
}

export const useModelStore = create<ModelData>((set, get) => ({
    modelList: {low: {
        scene: null,
        nodes: null,
        materials: null
        }, 
    med: {
        scene: null,
        nodes: null,
        materials: null
        }, 
    high: {
        scene: null,
        nodes: null,
        materials: null
        }},
    activeRes: 'low',
    lowLoaded: false,
    modelsLoaded: false,
    setActiveRes: (res: string) => set({ activeRes: res}),
    setLowLoaded: (value: boolean) => set({ lowLoaded: value }),
    setModelsLoaded: (value: boolean) => set({ modelsLoaded: value}),
    loadModel: async (key: string, url: string) => {
        const loader = getGLTFLoader();

        if (get().modelList[key].nodes == null) {
            const gltf = await loader.loadAsync(url);
            const nodes: Record<string, THREE.Object3D> = {};
            const materials: Record<string, THREE.Material> = {};
            gltf.scene.traverse((child) => {

                if (child instanceof THREE.Mesh) {
                    
                    if (child.name) {
                        nodes[child.name] = child;
                    }
                    if (child.material && child.material.name) {
                        materials[child.material.name] = child.material;
                    }
                }
            });

            set((state) => ({
                modelList: {
                    ...state.modelList,
                    [key]: { scene: gltf.scene, nodes: nodes, materials: materials }
                }
            })
            )
        }
    }
}));

