import { WaterMaterial } from '../materials/WaterMaterial';
import { FboMaterial } from "../materials/FBOMaterial";
import { ReactThreeFiber } from '@react-three/fiber';
import { RefractMaterial } from 'materials/RefractMaterial';

declare module '@react-three/fiber' {
  interface ThreeElements {
    refractMaterial: ReactThreeFiber.Node<
    InstanceType<typeof RefractMaterial>,
    typeof RefractMaterial
    >;
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    fboMaterial: ReactThreeFiber.Node<
    InstanceType<typeof FboMaterial>,
    typeof FboMaterial
    >;
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    waterMaterial: ReactThreeFiber.Node<
    InstanceType<typeof WaterMaterial>,
    typeof WaterMaterial
    >;
  }
}



