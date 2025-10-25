import {describe, it, expect, vi, beforeEach} from 'vitest';
import {vehiclesService} from '../src/services/vehicles.service';
import {vehiclesRepo} from '../src/repositories/vehicles.repo';
import {VehicleStatus} from '@vm/shared';

// Mock the repository
vi.mock('../src/repositories/vehicles.repo', () => ({
    vehiclesRepo: {
        findById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        countAll: vi.fn(),
        countByStatus: vi.fn(),
    },
}));

describe('Vehicle Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('gets a vehicle by id', async () => {
        const mockVehicle = {
            id: '1',
            licensePlate: '12-345-67',
            status: VehicleStatus.Available,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
        };

        vi.mocked(vehiclesRepo.findById).mockResolvedValue(mockVehicle);

        const result = await vehiclesService.get('1');

        expect(result).toEqual(mockVehicle);
    });

    it('throws error when vehicle not found', async () => {
        vi.mocked(vehiclesRepo.findById).mockResolvedValue(null);

        await expect(vehiclesService.get('999')).rejects.toThrow('Vehicle not found');
    });

    it('creates a vehicle', async () => {
        const mockVehicle = {
            id: '1',
            licensePlate: '12-345-67',
            status: VehicleStatus.Available,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
        };

        vi.mocked(vehiclesRepo.create).mockResolvedValue(mockVehicle);

        const result = await vehiclesService.create('12-345-67');

        expect(result.licensePlate).toBe('12-345-67');
    });

    it('rejects invalid status transitions', async () => {
        vi.mocked(vehiclesRepo.findById).mockResolvedValue({
            id: '1',
            licensePlate: '12-345-67',
            status: VehicleStatus.Maintenance,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
        });

        await expect(
            vehiclesService.update('1', {status: VehicleStatus.InUse})
        ).rejects.toThrow('Maintenance can only move to Available');
    });

    it('enforces maintenance cap', async () => {
        vi.mocked(vehiclesRepo.findById).mockResolvedValue({
            id: '1',
            licensePlate: '12-345-67',
            status: VehicleStatus.Available,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
        });
        vi.mocked(vehiclesRepo.countAll).mockResolvedValue(100);
        vi.mocked(vehiclesRepo.countByStatus).mockResolvedValue(5); // At cap

        await expect(
            vehiclesService.update('1', {status: VehicleStatus.Maintenance})
        ).rejects.toThrow('Maintenance cap reached');
    });

    it('prevents deleting InUse vehicles', async () => {
        vi.mocked(vehiclesRepo.findById).mockResolvedValue({
            id: '1',
            licensePlate: '12-345-67',
            status: VehicleStatus.InUse,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
        });

        await expect(vehiclesService.remove('1')).rejects.toThrow('Cannot delete');
    });
});