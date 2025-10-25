import {Vehicle, VehicleStatus} from "@vm/shared";

type PrismaVehicle = {
    id: string;
    licensePlate: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

export function mapPrismaVehicleToVehicle(prismaVehicle: PrismaVehicle): Vehicle {
    return {
        id: prismaVehicle.id,
        licensePlate: prismaVehicle.licensePlate,
        status: prismaVehicle.status as VehicleStatus,
        createdAt: prismaVehicle.createdAt.toISOString(),
        updatedAt: prismaVehicle.updatedAt.toISOString(),
    };
}