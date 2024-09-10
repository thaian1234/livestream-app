import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface INodemailService
    extends Utils.AutoMappedClass<NodemailService> {}

export class NodemailService implements INodemailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        } as SMTPTransport.MailOptions);
    }
    private emailConfig(
        subject: string,
        message: string,
        toEmail: string,
    ): Mail.Options {
        return {
            subject: subject,
            from: {
                name: "Livestream Application",
                address: process.env.SMTP_USER || "anacelol123@gmail.com",
            },
            to: toEmail,
            text: message,
            html: message,
        };
    }
    public async sendVerifcationEmailCode(code: string, toEmail: string) {
        const options = this.emailConfig("Verification Code", code, toEmail);
        const { accepted } = await this.transporter.sendMail(options);
        if (!accepted) {
            throw new MyError.ServiceUnavailableError(
                "Cannot send verification code to your email. Please try again!",
            );
        }
    }
}
