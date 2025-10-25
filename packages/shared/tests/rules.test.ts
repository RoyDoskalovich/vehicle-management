import {describe, it, expect} from 'vitest';
import {canTransition, canDelete, canEnterMaintenance, VehicleStatus} from '../src';

describe('Business Rules', () => {
    it('allows Available vehicle to change to any status', () => {
        expect(canTransition(VehicleStatus.Available, VehicleStatus.InUse)).toBe(true);
        expect(canTransition(VehicleStatus.Available, VehicleStatus.Maintenance)).toBe(true);
    });

    it('only allows Maintenance to change to Available', () => {
        expect(canTransition(VehicleStatus.Maintenance, VehicleStatus.Available)).toBe(true);
        expect(canTransition(VehicleStatus.Maintenance, VehicleStatus.InUse)).toBe(false);
    });

    it('only allows deleting Available vehicles', () => {
        expect(canDelete(VehicleStatus.Available)).toBe(true);
        expect(canDelete(VehicleStatus.InUse)).toBe(false);
        expect(canDelete(VehicleStatus.Maintenance)).toBe(false);
    });

    it('calculates maintenance cap correctly', () => {
        expect(canEnterMaintenance(4, 100)).toBe(true);  // 4 out of 100 is under 5%
        expect(canEnterMaintenance(5, 100)).toBe(false); // 5 out of 100 is at 5%
        expect(canEnterMaintenance(0, 20)).toBe(true);   // 0 out of 20 is under cap
        expect(canEnterMaintenance(1, 20)).toBe(false);  // 1 out of 20 is at cap
    });
});