import {describe, it, expect} from 'vitest';
import {licensePlateSchema, createVehicleSchema} from '../src';

describe('Validation', () => {
    it('accepts valid license plates', () => {
        expect(licensePlateSchema.parse('12-345-67')).toBe('12-345-67');
    });

    it('uppercases license plates', () => {
        expect(licensePlateSchema.parse('abc-123')).toBe('ABC-123');
    });

    it('rejects too short license plates', () => {
        expect(() => licensePlateSchema.parse('A')).toThrow();
    });

    it('accepts valid create data', () => {
        const result = createVehicleSchema.parse({licensePlate: '12-345-67'});
        expect(result.licensePlate).toBe('12-345-67');
    });
});