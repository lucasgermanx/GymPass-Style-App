import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { Profile } from "./profile";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance) {
    app.post("/users", register)
    app.post("/sessions", authenticate)

    app.patch("/token/refresh", refresh)

    app.get("/me", { onRequest: [VerifyJWT] }, Profile)
}