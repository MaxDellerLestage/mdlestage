import { useEffect } from 'react';
import { useModelStore } from '../stores/useModelStore';

/*
    This function serves to load the model concurrently while loading the website.
    I have experimented with different levels of detail to balance visual quality with performance,
    but the higher quality models are too high res as it stands. I have found that the lowest quality
    model is visually acceptable for the moment so I will revisit this issue later.
*/

export function ModelPreload() {
    const loadModel = useModelStore((state) => state.loadModel);
    const setActiveRes = useModelStore((state) => state.setActiveRes);
    const setLowLoaded = useModelStore((state) => state.setLowLoaded);
    const setModelsLoaded = useModelStore((state) => state.setModelsLoaded);
    const modelsLoaded = useModelStore((state) => state.modelsLoaded);
    

    useEffect(() => {
        let cancelled = false;

        // This function calls loadModel() from useModelStore for different levels of detail concurrently.
        async function loadAll() {
            
            await loadModel('low', '/assets/models/model_low_res.glb');
            if (cancelled) return;
            setActiveRes('low');
            setLowLoaded(true);
            setModelsLoaded(true);

            /* loadModel('med', '/assets/models/model_med_res.glb').then(() => {
                if (cancelled) return
                setActiveRes('med')
                console.log("Returning med-res model loader"); 
            })

            loadModel('high', '/assets/models/model_hi_res.glb').then(() => {
                if (cancelled) return
                setActiveRes('high')
                console.log("Returning hi-res model loader"); 
                setModelsLoaded(true);
            }) */
        }
        
        if (modelsLoaded) return;
        loadAll();
        
        return () => { cancelled = true }
    }, [modelsLoaded, loadModel, setActiveRes, setLowLoaded, setModelsLoaded]);

    return null;
}