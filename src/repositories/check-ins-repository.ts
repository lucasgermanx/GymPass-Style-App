import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
    findById(id: string): Promise<CheckIn | null>;
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>
    countByUserId(user_id: string): Promise<number>
    findByUserIdOnDate(userId: string, data: Date): Promise<CheckIn | null>
    save(checkIn: CheckIn): Promise<CheckIn>
}