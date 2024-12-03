import { UserDTO } from "../dtos/user.dto";
import { Utils } from "../lib/helpers/utils";
import { IUserRepository } from "../repositories/user.repository";

export interface IUserService extends Utils.AutoMappedClass<UserService> {}

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}
    public async createUser(data: UserDTO.Insert) {
        return await this.userRepository.create(data);
    }
    public async updateUser(id: string, data: UserDTO.Update) {
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
        currentUserId: string | null,
    ) {
        return await this.userRepository.advancedSearchUser(
            username,
            dateFrom,
            dateTo,
            isSortByCreatedAt,
            sortOrder,
            offset,
            limit,
            currentUserId,
        );
    }
    public async updatePassword(userId: string, newPassword: string) {
        const hashedPassword =
            await Utils.PasswordUtils.hashPassword(newPassword);
        const updatedUser = await this.userRepository.update(userId, {
            hashedPassword: hashedPassword,
        });
        return updatedUser;
    }
    public async isMatchedPassword(userId: string, currentPassword: string) {
        const existingUser =
            await this.userRepository.findUserWithAccount(userId);
        if (
            !existingUser ||
            !existingUser.hashedPassword ||
            existingUser.accounts.length > 0
        ) {
            return false;
        }
        return Utils.PasswordUtils.verifyHash(
            existingUser.hashedPassword,
            currentPassword,
        );
    }
    public async findByUsername(username: string) {
        return this.userRepository.findByUsername(username);
    }
    public async createUserWithStreamAndSetting() {}
    public async getUserById(userId: string) {
        return this.userRepository.findById(userId);
    }
}
