import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/*
    This function is used to setup the proper loader for the .glb model displayed on the home page.
*/

let loader: GLTFLoader;

export function getGLTFLoader() {
    if (!loader) {
        loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        dracoLoader.setDecoderConfig({ type: 'js'});

        loader.setDRACOLoader(dracoLoader);
    }

    return loader;
}