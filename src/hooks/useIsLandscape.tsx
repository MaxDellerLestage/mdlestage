import { useThree } from '@react-three/fiber';

/*
    Not currently being used.
*/

export function useIsLandscape() {
    const { viewport } = useThree();
    return viewport.width > viewport.height;
}