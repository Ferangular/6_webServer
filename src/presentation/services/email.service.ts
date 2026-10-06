import nodemailer, { Transporter } from 'nodemailer';

export interface Attachment {
    filename: string;
    path: string;
}

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

export class EmailService {
    private readonly transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailPassword: string,
    ) {
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: { user: mailerEmail, pass: senderEmailPassword },
        });
    }

    async sendEmail({ to, subject, htmlBody, attachments = [] }: SendMailOptions): Promise<boolean> {
        try {
            await this.transporter.sendMail({ to, subject, html: htmlBody, attachments });
            return true;
        } catch {
            return false;
        }
    }
}
