import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"
import { app } from "@/app"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";


describe("Nearby Gym (E2E)", () => {
    beforeAll(async () => {
        await app.ready()
    });

    afterAll(async () => {
        await app.close()
    });

    it("should be able to list nearby gyms", async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server).post("/gyms").set("Authorization", "Bearer " + token).send({
            title: "Javascript gym",
            description: "Some description",
            phone: "21 99999-9999",
            latitude: -22.5968128,
            longitude: -42.7360256,
        })

        await request(app.server).post("/gyms").set("Authorization", "Bearer " + token).send({
            title: "Typescript gym",
            description: "Some description",
            phone: "21 99999-9999",
            latitude: -17.2269672,
            longitude: -40.7920869,
        })
        const response = await request(app.server)
            .get("/gyms/nearby")
            .query({
                latitude: -22.5968128,
                longitude: -42.7360256,
            })
            .set("Authorization", "Bearer " + token)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: "Javascript gym" })
        ])
    })
})