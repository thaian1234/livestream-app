import { Utils } from "../lib/helpers/utils";

import { IForgetPasswordRepository } from "../repositories/forget-password.repository";

export interface IForgetPasswordService
    extends Utils.AutoMappedClass<ForgetPasswordService> {}

export class ForgetPasswordService implements IForgetPasswordService {
    constructor(private forgetPasswordRepository: IForgetPasswordRepository) {}
    public async save(userId: string) {
        return await this.forgetPasswordRepository.save(userId);
    }
    public async findByUserId(userId: string) {
        return await this.forgetPasswordRepository.findByUserId(userId);
    }
    public async deleteById(id: string) {
        return await this.forgetPasswordRepository.delete(id);
    }
    public async findById(id: string) {
        return await this.forgetPasswordRepository.findById(id);
    }
}
