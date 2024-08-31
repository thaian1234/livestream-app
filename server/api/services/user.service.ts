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
}
