import { create } from 'zustand';


interface ClickState {
    clicked: boolean
    isAnimating: boolean
    setClick: (value: boolean) => void
    setIsAnimating: (value: boolean) => void
}

export const useClickStore = create<ClickState>((set) => ({
    clicked: false,
    isAnimating: true,
    setClick: (value) =>
        set(() => ({ clicked: value})),
    setIsAnimating: (value) =>
        set(() => ({ isAnimating: value}))
}))