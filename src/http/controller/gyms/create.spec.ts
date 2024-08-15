import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"
import { app } from "@/app"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";


describe("Create Gym (E2E)", () => {
    beforeAll(async () => {
        await app.ready()
    });

    afterAll(async () => {
        await app.close()
    });

    it("should be able to create a gym", async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        const response = await request(app.server).post("/gyms").set("Authorization", "Bearer " + token).send({
            title: "Javascript gym",
            description: "Some description",
            phone: "21 99999-9999",
            latitude: -22.5968128,
            longitude: -42.7360256,
        })

        expect(response.statusCode).toEqual(201)
    })
})