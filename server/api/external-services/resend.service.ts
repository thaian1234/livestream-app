import { Utils } from "../lib/helpers/utils";
import { EmailVerificationTemplate } from "../lib/templates/email-verification.templates";
import { Resend } from "resend";

export interface IResendSerivce extends Utils.AutoMappedClass<ResendService> {}

export class ResendService {
    resend;
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }
    public async sendVerifcationEmailCode(code: string, toEmail: string) {
        const { data, error } = await this.resend.emails.send({
            from: "Acme <livestream@gmail.com>",
            to: toEmail,
            subject: "Email Verification",
            react: EmailVerificationTemplate({ code }),
        });
        console.log("Success", data?.id);
        console.log("Has error: ", error);
    }
}
