import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { SearchGymsUseCase } from "./search-gyms";
import { title } from "process";

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase;

describe("Search Gyms use case", () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    });
    it("should be able to search for gyms", async () => {

        await gymsRepository.create({
            title: "Javascript gym",
            description: null,
            phone: null,
            latitude: -22.5968128,
            longitude: -42.7360256,
        })
        await gymsRepository.create({
            title: "Typescript gym",
            description: null,
            phone: null,
            latitude: -22.5968128,
            longitude: -42.7360256,
        })

        const { gyms } = await sut.execute({
            query: "Javascript",
            page: 1
        });

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript gym" })
        ])
    })

    it("should be able to fetch paginated gym search", async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript gym ${i}`,
                description: null,
                phone: null,
                latitude: -22.5968128,
                longitude: -42.7360256,
            })
        }

        const { gyms } = await sut.execute({
            query: "Javascript",
            page: 2
        });
        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Javascript gym 21" }),
            expect.objectContaining({ title: "Javascript gym 22" })
        ])
    })
})