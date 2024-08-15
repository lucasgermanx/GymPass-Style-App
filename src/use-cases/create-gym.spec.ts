
import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;
describe("Create Gym use case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository;
        sut = new CreateGymUseCase(gymsRepository);
    })

    it("should be able to create gym", async () => {

        const { gym } = await sut.execute({
            title: "Corpo Em forma",
            description: null,
            phone: null,
            latitude: -22.5968128,
            longitude: -42.7360256,
        });

        expect(gym.id).toEqual(expect.any(String));
    })
});