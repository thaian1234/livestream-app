import { Utils } from "../lib/helpers/utils";
import { IEmailVerificationRepository } from "../repositories/email-verification.repository";

export interface IEmailVerificationService
    extends Utils.AutoMappedClass<EmailVerificationService> {}

export class EmailVerificationService implements IEmailVerificationService {
    constructor(
        private readonly emailVerficationRepository: IEmailVerificationRepository,
    ) {}
    public async generateEmailVerificationCode(userId: string) {
        return await this.emailVerficationRepository.generateEmailVerificationCode(
            userId,
        );
    }
    public async verifyCode(userId: string, code: string) {
        return await this.emailVerficationRepository.verifyCode(userId, code);
    }
}
