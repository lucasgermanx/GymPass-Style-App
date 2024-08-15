import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repositories";
import { ValidateCheckInUseCase } from "../validate-checkin";

export function makeValidateCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const useCase = new ValidateCheckInUseCase(checkInsRepository);

    return useCase;
}