export class HttpError extends Error {
    status: number;
    code: string;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

export const badRequest = (msg: string) => new HttpError(400, "BadRequest", msg);
export const notFound = (msg: string) => new HttpError(404, "NotFound", msg);
export const conflict = (msg: string) => new HttpError(409, "Conflict", msg);
