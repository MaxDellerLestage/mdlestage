import { create } from 'zustand';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/*
    The SVG store is used to load and recreate SVGs into a format which is usable by three.js.
*/

interface SVGItem {
    name: string
    group: THREE.Group
}

interface SVGState {
    svgList: SVGItem[]
    loadSVG: (url: string, name: string) => void
    getSVG: (name: string) => THREE.Group | undefined
}

export const useSvgStore = create<SVGState>((set, get) => ({
    svgList: [],
    loadSVG: (url: string, name: string) => {
        const loader = new SVGLoader();
        loader.load(url, function(data) {
            const paths = data.paths;
            const group = new THREE.Group();

            for (let i=0; i<paths.length; i++) {
                const path = paths[i];

                if (path.userData!.style.stroke !== undefined && path.userData!.style.stroke !== 'none') {
                    const strokeMaterial = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(1,1,1),
                        side: THREE.DoubleSide,
                        depthWrite: false
                    });
                
                    for (let j=0; j<path.subPaths.length; j++) {
                        const subPath = path.subPaths[j];
                        const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData!.style);
                        if (geometry) {
                            const mesh = new THREE.Mesh(geometry, strokeMaterial);
                            group.add(mesh);
                        }
                    }
                }
            }

            set((state) => ({
                svgList: [...state.svgList, { name, group }]
            }))
        });
    },
    getSVG: (name: string) => {
        return get().svgList.find((svg) => svg.name === name)?.group;
    }
}))