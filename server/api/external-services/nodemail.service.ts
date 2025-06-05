import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { envServer } from "@/lib/env/env.server";

import { MyError } from "../lib/helpers/errors";
import { Utils } from "../lib/helpers/utils";

export interface INodemailService
    extends Utils.AutoMappedClass<NodemailService> {}

export class NodemailService implements INodemailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: envServer.SMTP_HOST,
            port: envServer.SMTP_PORT,
            auth: {
                user: envServer.SMTP_USER,
                pass: envServer.SMTP_PASS,
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
                address: envServer.SMTP_USER,
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
    public async sendForgetPasswordLink(url: string, toEmail: string) {
        const htmlMessage = `
        <div>
            <h2>Click the link below to reset your password:</h2>
            <a href="${url}">link</a>
        </div>
        `;
        const options = this.emailConfig(
            "Forget Password",
            htmlMessage,
            toEmail,
        );
        const { accepted } = await this.transporter.sendMail(options);

        if (!accepted) {
            throw new MyError.ServiceUnavailableError(
                "Fail to send reset password link to your email. Please try again!",
            );
        }
    }
}
