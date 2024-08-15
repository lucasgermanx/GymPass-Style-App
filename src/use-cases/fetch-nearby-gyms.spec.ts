import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms use case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    });
    it("should be able to fetch nearby gyms", async () => {

        await gymsRepository.create({
            title: "Far gym",
            description: null,
            phone: null,
            latitude: -17.2269672,
            longitude: -40.7920869,
        })
        await gymsRepository.create({
            title: "Near gym",
            description: null,
            phone: null,
            latitude: -22.5968128,
            longitude: -42.7360256,
        })

        const { gyms } = await sut.execute({
            userLatitude: -22.5968128,
            userLongitude: -42.7360256
        });

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Near gym" })
        ])
    })
})