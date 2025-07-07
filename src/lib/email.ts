// src/lib/email.ts
export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

/**
 * 실제 메일 발송 로직을 여기에 구현하세요.
 * 예: SendGrid, Nodemailer, AWS SES 등
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // TODO: 이 부분을 실제 메일 서비스 호출 코드로 바꿔주세요.
  console.log(`[메일 전송] to=${options.to}, subject=${options.subject}`);
  console.log(`내용: ${options.text}`);
}
