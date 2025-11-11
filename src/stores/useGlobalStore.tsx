import { create } from 'zustand';
import type { PageData } from '../types/Page';


/*
    The global store is used to manage states between paths and activate flags for transition states.
*/

interface GlobalState {
    pages: PageData[]
    current_page: string
    prev_page: string
    global_anim: boolean
    global_first: boolean
    reverse_anim: boolean
    reverse_first: boolean
    global_hover: boolean
    first_load: boolean
    setPage: (name: string, value: boolean) => void
    setVisible: (name: string, value: boolean) => void
    setCurrentPage: (name: string) => void
    setPrevPage: (name: string) => void
    setGlobalAnim: (value: boolean) => void
    setGlobalFirst: (value: boolean) => void
    setReverseAnim: (value: boolean) => void
    setReverseFirst: (value: boolean) => void
    setFirstLoad: (value: boolean) => void
    setHovered: (name: string, value: boolean) => void
    setGlobalHover: (value: boolean) => void
};

export const useGlobalStore = create<GlobalState>((set) => ({
    pages: [
        {
            page_name: "Home",
            visible: true,
            active: true,
            hovered: false,
            id: 0
        },
        {
            page_name: "Contact",
            visible: false,
            active: false,
            hovered: false,
            id: 1
        },
        {
            page_name: "Animation",
            visible: false,
            active: false,
            hovered: false,
            id: 2
        },
        {
            page_name: "Computers",
            visible: false,
            active: false,
            hovered: false,
            id: 3
        },
        {
            page_name: "Art",
            visible: false,
            active: false,
            hovered: false,
            id: 4
        },
        {
            page_name: "LinkedIn",
            visible: false,
            active: false,
            hovered: false,
            id: 5
        },
        {
            page_name: "Github",
            visible: false,
            active: false,
            hovered: false,
            id: 6
        },
        {
            page_name: "Email",
            visible: false,
            active: false,
            hovered: false,
            id: 7
        }
    ],
    current_page: 'Home',
    prev_page: 'Home',
    global_anim: false,
    global_first: false,
    reverse_anim: false,
    reverse_first: false,
    global_hover: false,
    first_load: true,
    setPage: (name, value) =>
        set((state) => {
            const pageStatus = [...state.pages];
            for (let i=0; i<pageStatus.length; i++) {
                if (name==pageStatus[i].page_name) {
                    pageStatus[i].active = value
                }
            }
            return { pages: pageStatus}
        }),
    setVisible: (name, value) =>
        set((state) => {
            const pageStatus = [...state.pages];
            for (let i=0; i<pageStatus.length; i++) {
                if (name==pageStatus[i].page_name) {
                    pageStatus[i].visible = value
                }
            }
            return { pages: pageStatus}
        }),
    setCurrentPage: (name) =>
        set(() => ({ current_page: name })),
    setPrevPage: (name) =>
        set(() => ({ prev_page: name })),
    setGlobalAnim: (value) =>
        set(() => ({ global_anim: value})),
    setGlobalFirst: (value) =>
        set(() => ({ global_first: value})),
    setReverseAnim: (value) =>
        set(() => ({ reverse_anim: value})),
    setReverseFirst: (value) =>
        set(() => ({ reverse_first: value})),
    setFirstLoad: (value) =>
        set(() => ({ first_load: value })),
    setHovered: (name, value) =>
        set((state) => {
            const pageStatus = [...state.pages];
            for (let i=0; i<pageStatus.length; i++) {
                if (name==pageStatus[i].page_name) {
                    pageStatus[i].hovered = value
                }
            }
            return { pages: pageStatus}
         }),
    setGlobalHover: (value) =>
        set(() => ({ global_hover: value}))
}));

