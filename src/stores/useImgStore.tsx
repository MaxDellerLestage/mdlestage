import { create } from 'zustand';

/*
    The ImgStore is used exclusively to manage state for the ArtContent page. 
    When a given image is selected, it triggers the state change and freezes 
    all other ImgDisplay components until the active image is released.
*/

interface ImgState {
    isActive: number
    setActive: (value: number) => void
}

export const useImgStore = create<ImgState>((set) => ({
    isActive: -1,
    setActive: (value: number) => set({ isActive: value })
}))