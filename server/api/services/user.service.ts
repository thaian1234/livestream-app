import { Utils } from "../lib/helpers/utils";
import { UserValidation } from "../lib/validations/schema.validation";
import { IUserRepository } from "../repositories/user.repository";

export interface IUserService extends Utils.AutoMappedClass<UserService> {}

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}
    public async createUser(data: UserValidation.Insert) {
        return await this.userRepository.create(data);
    }
    public async updateUser(id: string, data: UserValidation.Update) {
        return await this.userRepository.update(id, data);
    }
    public async getAllUser() {
        return await this.userRepository.findAll();
    }
    public async getUserByEmailOrUsername(email: string, username?: string) {
        if (!username) {
            return await this.userRepository.findByEmail(email);
        }
        return await this.userRepository.findByEmailOrUsername(email, username);
    }
    public async getUserByEmail(email: string) {
        return await this.userRepository.findByEmail(email);
    }
    public async advancedSearchUser(
        username: string = "",
        dateFrom: Date = new Date("2000-01-01"),
        dateTo: Date = new Date(),
        isSortByCreatedAt: boolean = false,
        sortOrder: string = "asc",
        offset: number = 0,
        limit: number = 10,
    ) {
        return await this.userRepository.advancedSearchUser(
            username,
            dateFrom,
            dateTo,
            isSortByCreatedAt,
            sortOrder,
            offset,
            limit,
        );
    }
}
