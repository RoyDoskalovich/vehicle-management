export enum VehicleStatus {
    Available = "Available",
    InUse = "InUse",
    Maintenance = "Maintenance",
}

export interface Vehicle {
    id: string;
    licensePlate: string;
    status: VehicleStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVehicleDto {
    licensePlate: string;
}

export interface UpdateVehicleDto {
    licensePlate?: string;
    status?: VehicleStatus;
}

export interface UpdateVehicleStatusDTO {
    status: VehicleStatus;
}