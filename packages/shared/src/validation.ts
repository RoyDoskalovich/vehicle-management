import {z} from "zod";
import {VehicleStatus} from "./types";

const statusValues = [VehicleStatus.Available, VehicleStatus.InUse, VehicleStatus.Maintenance] as const;

export const licensePlateSchema = z.string().min(2).max(20).transform(s => s.trim().toUpperCase());

export const createVehicleSchema = z.object({licensePlate: licensePlateSchema});

export const updateVehicleSchema = z.object({
    licensePlate: licensePlateSchema.optional(),
    status: z.nativeEnum(VehicleStatus).optional(),
});

export const updateStatusSchema = z.object({status: z.nativeEnum(VehicleStatus)});