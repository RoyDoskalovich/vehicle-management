import {api} from "./client"
import {z} from "zod";
import {
    Vehicle,
    VehicleStatus,
    createVehicleSchema,
    updateVehicleSchema,
    updateStatusSchema,
} from "@vm/shared";

const vehicleSchema = z.object({
    id: z.string(),
    licensePlate: z.string(),
    status: z.nativeEnum(VehicleStatus),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const listResponseSchema = z.object({
    data: z.array(vehicleSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
});

export type ListResponse = z.infer<typeof listResponseSchema>;

export const VehiclesAPI = {
    list(params?: {
        status?: VehicleStatus;
        search?: string;
        sort?: "createdAt" | "licensePlate";
        order?: "asc" | "desc";
        page?: number;
        pageSize?: number;
    }): Promise<ListResponse> {
        return api.get("/vehicles", {params}).then(r => listResponseSchema.parse(r.data));
    },

    get(id: string): Promise<Vehicle> {
        return api.get(`/vehicles/${id}`).then(r => r.data);
    },

    create(data: z.infer<typeof createVehicleSchema>): Promise<Vehicle> {
        return api.post("/vehicles", data).then(r => r.data);
    },

    update(id: string, data: z.infer<typeof updateVehicleSchema>): Promise<Vehicle> {
        return api.put(`/vehicles/${id}`, data).then(r => r.data);
    },

    updateStatus(id: string, data: z.infer<typeof updateStatusSchema>): Promise<Vehicle> {
        return api.patch(`/vehicles/${id}/status`, data).then(r => r.data);
    },

    remove(id: string): Promise<void> {
        return api.delete(`/vehicles/${id}`).then(() => {
        });
    },
}