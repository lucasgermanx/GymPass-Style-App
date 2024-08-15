import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repositories";
import { CheckInUseCase } from "./checkin";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repositories";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOffCheckIns } from "./errors/max-number-off-checkins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Get User Profile use case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymRepository = new InMemoryGymsRepository()

        sut = new CheckInUseCase(checkInsRepository, gymRepository)


        await gymRepository.create({
            id: "gym-01",
            title: "Corpo Em forma",
            description: "",
            phone: "",
            latitude: -22.5968128,
            longitude: -42.7360256,
        })
        vi.useFakeTimers()
    });

    afterEach(() => {
        vi.useRealTimers()
    })
    it("should be able to check in", async () => {

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -22.5968128,
            userLongitude: -42.7360256
        });

        expect(checkIn.id).toEqual(expect.any(String));
    })

    it("should not be able to check in twice in the same day", async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -22.5968128,
            userLongitude: -42.7360256
        })

        await expect(() => sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -22.5968128,
            userLongitude: -42.7360256
        })).rejects.toBeInstanceOf(MaxNumberOffCheckIns)
    })

    it("should be able to check in twice but in different days", async () => {

        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -22.5968128,
            userLongitude: -42.7360256
        })
        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: "gym-01",
            userId: "user-01",
            userLatitude: -22.5968128,
            userLongitude: -42.7360256
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it("should not be able to check in on distant gym", async () => {

        gymRepository.items.push({
            id: "gym-02",
            title: "Corpo Em forma",
            description: "",
            phone: "",
            latitude: new Decimal(-22.5865197),
            longitude: new Decimal(-42.6871556),
        })

        await expect(() =>
            sut.execute({
                gymId: "gym-02",
                userId: "user-01",
                userLatitude: -22.5968128,
                userLongitude: -42.7360256
            })).rejects.toBeInstanceOf(MaxDistanceError)
    })
})