import type {Request, Response, NextFunction} from "express";
import {z} from "zod";
import {
    VehicleStatus as VS, createVehicleSchema,
    updateVehicleSchema, updateStatusSchema
} from "@vm/shared";
import type {VehicleStatus} from "@vm/shared";
import {vehiclesService} from "../services/vehicles.service";

const statusValues = [VS.Available, VS.InUse, VS.Maintenance] as const;

const listQuerySchema = z.object({
    status: z.enum(statusValues).optional(),
    search: z.string().trim().optional(),
    sort: z.enum(["createdAt", "licensePlate"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const vehiclesController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const q = listQuerySchema.parse(req.query);

            const vehicles = await vehiclesService.list(q as {
                status?: VehicleStatus;
                search?: string;
                sort?: "createdAt" | "licensePlate";
                order?: "asc" | "desc";
            });

            res.json(vehicles);
        } catch (e) {
            next(e);
        }
    },

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const vehicle = await vehiclesService.get(req.params.id);
            res.json(vehicle);
        } catch (e) {
            next(e);
        }
    },

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const body = createVehicleSchema.parse(req.body);
            const created = await vehiclesService.create(body.licensePlate);
            res.status(201).json(created);
        } catch (e) {
            next(e);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const body = updateVehicleSchema.parse(req.body);
            const updated = await vehiclesService.update(req.params.id, body);
            res.json(updated);
        } catch (e) {
            next(e);
        }
    },

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const body = updateStatusSchema.parse(req.body);
            const updated = await vehiclesService.updateStatus(req.params.id, body.status);
            res.json(updated);
        } catch (e) {
            next(e);
        }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await vehiclesService.remove(req.params.id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
}