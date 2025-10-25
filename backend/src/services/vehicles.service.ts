import {vehiclesRepo} from "../repositories/vehicles.repo";
import {canEnterMaintenance, canTransition, canDelete, VehicleStatus as VS} from "@vm/shared";
import type {VehicleStatus} from "@vm/shared";
import {conflict, notFound} from "../utils/httpErrors";
import {Prisma} from "@prisma/client";

function mapPrismaErrors(e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return conflict("License plate already exists");
    }
    throw e;
}

export const vehiclesService = {
    list: vehiclesRepo.list,

    async get(id: string) {
        const vehicle = await vehiclesRepo.findById(id);
        if (!vehicle) throw notFound("Vehicle not found");
        return vehicle;
    },

    async create(licensePlate: string) {
        try {
            return await vehiclesRepo.create(licensePlate);
        } catch (e) {
            throw mapPrismaErrors(e);
        }
    },

    async update(id: string, patch: { licensePlate?: string; status?: VehicleStatus }) {
        const current = await vehiclesRepo.findById(id);
        if (!current) throw notFound("Vehicle not found");

        if (patch.status && patch.status !== current.status) {
            if (!canTransition(current.status, patch.status)) {
                throw conflict("A vehicle in Maintenance can only move to Available.");
            }
            if (patch.status === VS.Maintenance && current.status !== VS.Maintenance) {
                const [total, inMaint] = await Promise.all([
                    vehiclesRepo.countAll(),
                    vehiclesRepo.countByStatus(VS.Maintenance),
                ]);
                if (!canEnterMaintenance(inMaint, total)) {
                    throw conflict("Maintenance cap reached (max 5% of vehicles)");
                }
            }
        }
        try {
            return await vehiclesRepo.update(id, patch);
        } catch (e) {
            throw mapPrismaErrors(e);
        }
    },

    async updateStatus(id: string, to: VehicleStatus) {
        return this.update(id, {status: to});
    },

    async remove(id: string) {
        const current = await vehiclesRepo.findById(id);
        if (!current) throw notFound("Vehicle not found");

        if (!canDelete(current.status)) {
            throw conflict("Cannot delete a vehicle that is InUse or Maintenance.");
        }

        try {
            return await vehiclesRepo.remove(id);
        } catch (e) {
            throw mapPrismaErrors(e);
        }
    },
}