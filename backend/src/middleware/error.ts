import type {Request, Response, NextFunction} from "express";
import {HttpError} from "../utils/httpErrors";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.status).json({error: err.code, message: err.message});
    }
    if ((err as any)?.name === "ZodError") {
        return res.status(400).json({error: "ValidationError", details: (err as any).issues ?? []});
    }

    console.error("[UNHANDLED_ERROR]", err);
    return res.status(500).json({error: "InternalServerError", message: "Something went wrong"});
}