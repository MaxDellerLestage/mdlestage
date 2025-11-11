/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import * as React from 'react';
import { vi, afterEach } from 'vitest';
import { useGlobalStore } from '../stores/useGlobalStore'
import * as THREE from 'three';

afterEach(() => {
    useGlobalStore.setState({});
})

class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;

vi.mock('three/examples/jsm/loaders/GLTFLoader', () => {
    return {
        GLTFLoader: class {
            setDRACOLoader() {

            }
            async loadAsync() {
                const scene = new THREE.Group();

                scene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()));
                return Promise.resolve({
                    scene,
                    nodes: {},
                    materials: {},
                });
            }
        }
    }
});

vi.mock('three/examples/jsm/loaders/SVGLoader', () => {
    return {
        SVGLoader: class {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            load(_url: string, onLoad: Function) {
                onLoad({ paths: [] });
            }
        }
    }
})

