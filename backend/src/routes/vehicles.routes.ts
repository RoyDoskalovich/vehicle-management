import {Router} from "express";
import {vehiclesController} from "../controllers/vehicles.controller";
import {prisma} from "../db/prisma";
import {vehiclesRepo} from "../repositories/vehicles.repo";
import {vehiclesService} from "../services/vehicles.service";

export const vehiclesRouter = Router();

vehiclesRouter.get("/", vehiclesController.list);

vehiclesRouter.get("/:id", vehiclesController.get);

vehiclesRouter.post("/", vehiclesController.create);

// Full update (licensePlate and/or status).
vehiclesRouter.put("/:id", vehiclesController.update);

// Status-only update.
vehiclesRouter.patch("/:id/status", vehiclesController.updateStatus);

vehiclesRouter.delete("/:id", vehiclesController.remove);
