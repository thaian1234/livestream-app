import { Utils } from "../lib/helpers/utils";
import { UserValidation } from "../lib/validations/schema.validation";
import {
    IUserRepository,
    UserRepository,
} from "../repositories/user.repository";

export interface IUserService {
    createUser(
        data: UserValidation.Insert,
    ): Utils.MethodReturnType<UserService, "createUser">;
    updateUser(
        id: string,
        data: UserValidation.Update,
    ): Utils.MethodReturnType<UserService, "updateUser">;
    getAllUser(): Utils.MethodReturnType<UserService, "getAllUser">;
    getUserByEmailOrUsername(
        email: string,
        username: string,
    ): Utils.MethodReturnType<UserService, "getUserByEmailOrUsername">;
    getUserByEmail(
        email: string,
    ): Utils.MethodReturnType<UserService, "getUserByEmail">;
}

export class UserService implements IUserService {
    private userRepository: IUserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    public async createUser(data: UserValidation.Insert) {
        return await this.userRepository.create(data);
    }
    public async updateUser(id: string, data: UserValidation.Update) {
        return await this.userRepository.update(id, data);
    }
    public async getAllUser() {
        return await this.userRepository.findAll();
    }
    public async getUserByEmailOrUsername(email: string, username: string) {
        return await this.userRepository.findByEmailOrUsername(email, username);
    }
    public async getUserByEmail(email: string) {
        return await this.userRepository.findByEmail(email);
    }
}
