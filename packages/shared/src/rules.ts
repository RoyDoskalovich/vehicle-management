import {VehicleStatus} from "./types";

// Maintenance status can only be changed to available status.
export function canTransition(from: VehicleStatus, to: VehicleStatus): boolean {
    if (from === VehicleStatus.Maintenance) return to === VehicleStatus.Available;
    return true;
}

export function canDelete(status: VehicleStatus): boolean {
    return status === VehicleStatus.Available;
}

export function maintenanceCap(total: number): number {
    return Math.max(1, Math.floor(total * 0.05));
}

export function canEnterMaintenance(currentMaintenance: number, total: number): boolean {
    return currentMaintenance < maintenanceCap(total);
}