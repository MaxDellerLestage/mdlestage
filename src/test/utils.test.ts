import { expect, describe, it } from 'vitest';
import { randomXYZ, DegToRad, rotateObject, scaleObject, translateObject } from '../utils';
import * as THREE from 'three';

describe('randomXYZ', () => {
    it('Returns a 3 place vector of random numbers between 0 and 255', () => {
        const result = randomXYZ(0, 255);
        const result_2 = randomXYZ(0, 255);
        expect(result[0]).toBeGreaterThanOrEqual(0);
        expect(result[1]).toBeGreaterThanOrEqual(0);
        expect(result[2]).toBeGreaterThanOrEqual(0);
        expect(result[0]).toBeLessThanOrEqual(255);
        expect(result[1]).toBeLessThanOrEqual(255);
        expect(result[2]).toBeLessThanOrEqual(255);
        expect(result[0] != result_2[0]).toEqual(true);
        expect(result[1] != result_2[1]).toEqual(true);
        expect(result[2] != result_2[2]).toEqual(true);
    });
});

describe('DegToRad', () => {
    it('Returns the conversion of the input degrees to radians', () => {
        const result = DegToRad(180);
        expect(result).toEqual(Math.PI);
    });
});

describe('rotateObject', () => {
    it('Returns a vector which is equal to the input vector rotated by the rotation vector', () => {
        const result = rotateObject(new THREE.Vector3(5,0,0), [0,180,0]);
        expect(result.x).toEqual(-5);
    }) ;
});

describe('scaleObject', () => {
    it('Returns a vector which is equal to the input vector scaled by the inverse scale factor', () => {
        const result = scaleObject(new THREE.Vector3(1,1,1), 0.5);
        expect(result.x).toEqual(2);
    });
});

describe('translateObject', () => {
    it('Returns a vector which is equal to the input vector translated by the translation vector', () => {
        const result = translateObject(new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1));
        expect(result.x).toEqual(1);
    })
})