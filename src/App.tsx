import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './styles/index.css';

import { useGlobalStore } from './stores/useGlobalStore';
import { ModelPreload } from './functions/modelPreload';
import { TexPreload } from './functions/texPreload';
import { CameraSync } from './CameraSync';
import { useSpring, easings } from '@react-spring/three';

import { Home } from './components/Main_components/Home';
import { Contact } from './components/Main_components/Contact';
import { Animation } from './components/Main_components/Animation';
import { Computer } from './components/Main_components/Computer';
import { Art } from './components/Main_components/Art';
import { AnimContent } from './components/Content_components/Animation/AnimContent';
import { CompContent } from './components/Content_components/Computers/CompContent';
import { ArtContent } from './components/Content_components/Art/ArtContent';

/*
    This function ensures different paths correctly activate their
    corresponding states when linked externally or when using browser controls
*/

export function PathSync() {
    const { pages, setPage, setVisible, setCurrentPage } = useGlobalStore((state) => state);
    const location = useLocation();

    useEffect(() => {

    const path = location.pathname.replace('/', '') || 'home';
    
    // Iterate through page states to ensure only correct path is activate in useGlobalStore
    for (let i=0; i<pages.length; i++) {
        
        if (path==pages[i].page_name.toLowerCase()) {
            if (!pages[i].active) {
                setPage(pages[i].page_name, true);
                setVisible(pages[i].page_name, true);
                setCurrentPage(pages[i].page_name)
            }
        }
        else {
            if (pages[i].active) {
            setPage(pages[i].page_name, false);
            setVisible(pages[i].page_name, false);
                }
        }
    }

    }, [location, pages])
    
    return null;
}

const App: React.FC = () => {

    const { pages, current_page, global_anim } = useGlobalStore((state) => state);

    /*
        CameraAnim function controls the animated camera transitions between states.
        Clicking on any of the menu items on the home page will trigger the global_anim flag in the global store,
        while clicking the 'Home' item while in the sub pages will trigger the reverse_anim flag
    */

    function CameraAnim() {

        const { current_page, prev_page, global_anim, reverse_anim, setPage, setVisible, setGlobalAnim, setReverseAnim } = useGlobalStore((state) => state);
        
        const { camera } = useThree();
        const start_pos = useRef([0,0,12])
        const target_pos = useRef([0,0,12])
        const navigate = useNavigate();

        const [springs, api] = useSpring(() => ({
            position: start_pos.current,
            config: { duration: 1000, easing: easings.easeInCubic }
        }))

        useFrame(() => {
            
            if (global_anim) {
                target_pos.current = [0,0,-1];
                api.start({ position: target_pos.current});

                camera.position.lerp(
                    {
                        x: springs.position.get()[0],
                        y: springs.position.get()[1],
                        z: springs.position.get()[2]
                    },
                    0.4
                );

                camera.lookAt(0,0,-2);
                
                if (camera.position.z <= target_pos.current[2]+2) {
                    setGlobalAnim(false);
                    setVisible('Home', false);
                    setPage('Home', false);
                    navigate(`/${current_page.toLowerCase()}`);   
                }
                
            }

            if (reverse_anim) {

                start_pos.current = [0,0,-1]
                target_pos.current = [0,0,12];
                api.start({ position: target_pos.current});

                camera.position.lerp(
                    {
                        x: springs.position.get()[0],
                        y: springs.position.get()[1],
                        z: springs.position.get()[2]
                    },
                    0.2
                );

                camera.lookAt(0,0,-2);

                if (camera.position.z >= target_pos.current[2]-2) {
                    setReverseAnim(false);
                }
                else if (camera.position.z >= target_pos.current[2]-8) {
                    setVisible(prev_page, false);
                    setPage(prev_page, false);
                }
                else if (camera.position.z >= target_pos.current[2]-10.5) {
                    setVisible('Home', true);
                    setPage('Home', true);
                    navigate(`/`);
                }
                
            }
        })

        return null;

    }

    const width = 2.3;
    const height = 1.3;
    const depth = 3;

    const post_menu_positions = [
                                new THREE.Vector3(-width, height, -depth),
                                new THREE.Vector3(-width/3, height, -depth),
                                new THREE.Vector3(width/3, height, -depth),
                                new THREE.Vector3(width, height, -depth),
                            ];

    const category_names = ['Contact', 'Animation', 'Computers', 'Art'];
    
    return (
        <div className='canvas-container'>
            <ModelPreload />
            <Router>
                <PathSync />
                <Canvas id="canvas" camera={{ position: [0,0,10], far: 100000 }} dpr={[1,2]} shadows>
                    <CameraSync />
                    <CameraAnim />
                    <Home 
                        category_names={category_names}
                    />
                    {current_page == 'Animation' && (global_anim || !pages[2].active) ?
                        <AnimContent />
                        : null
                    }
                    {current_page == 'Computers' && (global_anim || !pages[3].active) ?
                        <CompContent />
                        : null
                    }
                    {current_page == 'Art' && (global_anim || !pages[4].active) ?
                        <ArtContent />
                        : null
                    }
                    <Routes>
                        <Route path={`/${category_names[0]}`.toLowerCase()}
                            element={
                                <Contact
                                    category_names={category_names}
                                    menu_positions={post_menu_positions}
                                />
                            }
                        />
                        <Route path={`/${category_names[1]}`.toLowerCase()}
                            element={
                                <Animation 
                                    category_names={category_names}
                                    menu_positions={post_menu_positions}
                                />
                            }
                        />
                        <Route path={`/${category_names[2]}`.toLowerCase()}
                            element={
                                <Computer 
                                    category_names={category_names}
                                    menu_positions={post_menu_positions}
                                />
                            }
                        />
                        <Route path={`/${category_names[3]}`.toLowerCase()}
                            element={
                                <Art
                                    category_names={category_names}
                                    menu_positions={post_menu_positions}
                                />
                            }
                        />
                    </Routes>
                </Canvas>
            </Router>
            <TexPreload num_images={8} />
        </div>
    )
}

export default App;