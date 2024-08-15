import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepositoy } from "@/repositories/gyms-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinates";
import { MaxNumberOffCheckIns } from "./errors/max-number-off-checkins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

interface CheckInUseCaseRequest {
    userId: string,
    gymId: string,
    userLatitude: number,
    userLongitude: number,
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepositoy
    ) { }

    async execute({ userId, gymId, userLatitude, userLongitude }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymsRepository.findById(gymId)
        if (!gym) throw new ResourceNotFoundError()

        const distance = getDistanceBetweenCoordinates(
            {
                latitude: userLatitude,
                longitude: userLongitude
            },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber()
            })
        const maxDistance = 0.1
        if (distance > maxDistance) throw new MaxDistanceError()

        const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())
        if (checkInOnSameDate) throw new MaxNumberOffCheckIns()

        const checkIn = await this.checkInsRepository.create({ gym_id: gymId, user_id: userId })

        return { checkIn };

    }
}