import * as fs from 'fs';
import { resolve } from 'path';
import * as emailjs from 'emailjs';
import { mjml2html } from 'mjml';
import * as htmlToText from 'html-to-text';
import * as handlebars from 'handlebars';
import { User, Release } from '../types';

const server = emailjs.server.connect({
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  host: process.env.MAIL_HOST,
  ssl: true,
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

function sendEmail(options: SendEmailParams): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    const { to, subject, html } = options;
    const text = htmlToText.fromString(html);
    const from = 'no-reply@octon.xyz';
    server.send(
      {
        text,
        from: `"Octon" <${from}>`,
        to: `"${to}" <${to}>`,
        subject,
        attachment: [{ data: html, alternative: true }],
      },
      (err, message) => {
        if (err) {
          reject(err);
        } else {
          resolvePromise(message);
        }
      }
    );
  });
}

function constructEmail(name: string, params: any): any {
  const templatePath = resolve(
    __dirname,
    '..',
    '..',
    'ressources',
    'templates',
    `${name}.html`
  );
  const file = fs.readFileSync(templatePath, 'utf8');
  let email = handlebars.compile(file);
  email = email(params);
  email = mjml2html(email);
  return email;
}

export function dailyUpdate(
  type: string,
  user: User,
  releases: Release[]
): Promise<any> {
  let subject = 'Daily update';
  if (type === 'weekly') {
    subject = 'Weekly update';
  }
  const html = constructEmail('releases-list', {
    releases,
    BASE_URL: process.env.BASE_URL,
  });
  return sendEmail({ to: user.email, subject, html: html.html });
}
