import {prisma} from "../db/prisma";
import {Prisma} from "@prisma/client";
import {VehicleStatus} from "@vm/shared";
import {mapPrismaVehicleToVehicle} from "../utils/mappers";

export interface ListParams {
    status?: VehicleStatus;
    search?: string;
    sort?: "createdAt" | "licensePlate";
    order?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}

export const vehiclesRepo = {
    async list({
                   status,
                   search,
                   sort = "createdAt",
                   order = "desc",
                   page = 1,
                   pageSize = 10,
               }: ListParams) {
        const where: Prisma.VehicleWhereInput = {};

        if (typeof search === "string" && search.trim() !== "") {
            where.licensePlate = { contains: search.trim().toUpperCase() };
        }

        if (status) {
            where.status = status;
        }

        const orderBy: Prisma.VehicleOrderByWithRelationInput =
            sort === "createdAt" ? { createdAt: order } : { licensePlate: order };

        const [rows, total] = await Promise.all([
            prisma.vehicle.findMany({
                where,
                orderBy,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }) as Promise<Prisma.VehicleGetPayload<{}>[]>,
            prisma.vehicle.count({ where }),
        ]);

        const data = Array.isArray(rows) ? rows.map(mapPrismaVehicleToVehicle) : [];

        return { data, total, page, pageSize };
    },

    // async list({
    //                status,
    //                search,
    //                sort = "createdAt",
    //                order = "desc",
    //                page = 1,
    //                pageSize = 10,
    //            }: ListParams) {
    //     const where: Prisma.VehicleWhereInput = {};
    //
    //     if (status) {
    //         where.status = status;
    //     }
    //     if (search && search.trim()) {
    //         where.licensePlate = {
    //             contains: search.trim().toUpperCase(),
    //         };
    //     }
    //
    //     const orderBy: Prisma.VehicleOrderByWithRelationInput =
    //         sort === "createdAt"
    //             ? {createdAt: order}
    //             : {licensePlate: order};
    //
    //     const vehicles = await prisma.vehicle.findMany({
    //         where,
    //         orderBy,
    //     });
    //
    //     return vehicles.map(v => mapPrismaVehicleToVehicle(v as any));
    // },

    async findById(id: string) {
        const vehicle = await prisma.vehicle.findUnique({where: {id}});
        return vehicle ? mapPrismaVehicleToVehicle(vehicle as any) : null;
    },

    async create(licensePlate: string) {
        const vehicle = await prisma.vehicle.create({
            data: {licensePlate: licensePlate.trim().toUpperCase()},
        });
        return mapPrismaVehicleToVehicle(vehicle as any);
    },

    async update(id: string, data: { licensePlate?: string; status?: VehicleStatus }) {
        const updateData: Prisma.VehicleUpdateInput = {};
        if (data.licensePlate) updateData.licensePlate = data.licensePlate.trim().toUpperCase();
        if (data.status) updateData.status = data.status;

        const vehicle = await prisma.vehicle.update({
            where: {id},
            data: updateData,
        });
        return mapPrismaVehicleToVehicle(vehicle as any);
    },

    async remove(id: string) {
        const vehicle = await prisma.vehicle.delete({where: {id}});
        return mapPrismaVehicleToVehicle(vehicle as any);
    },

    countAll() {
        return prisma.vehicle.count();
    },

    countByStatus(status: VehicleStatus) {
        return prisma.vehicle.count({where: {status}});
    },
};