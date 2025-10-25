import {PrismaClient, VehicleStatus} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const vehicles = [
        {licensePlate: "12-345-67", status: VehicleStatus.Available},
        {licensePlate: "89-XYZ-01", status: VehicleStatus.InUse},
        {licensePlate: "AB-123-CD", status: VehicleStatus.Maintenance},
        {licensePlate: "77-777-77", status: VehicleStatus.Available},
    ];

    for (const vehicle of vehicles) {
        await prisma.vehicle.upsert({
            where: {licensePlate: vehicle.licensePlate},
            update: {},
            create: vehicle,
        });
    }

    console.log("Seeded!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });