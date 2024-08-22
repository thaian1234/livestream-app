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
}
