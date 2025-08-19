// src/pages/api/email/sendCode.ts
import type { NextApiHandler } from "next";
import { sendEmail } from "@/lib/email";
import { nanoid } from "nanoid";
import { setCode } from "@/lib/otpStore";

const handler: NextApiHandler = async (req, res) => {
  const { email } = req.body;
  // 6자리 코드 생성
  const code = nanoid(6);
  // TTL은 otpStore 내부에서 5분으로 고정 처리
  setCode(email, code);
  await sendEmail({
    to: email,
    subject: "Diln 이메일 인증 코드",
    text: `인증 코드: ${code}`,
  });
  res.status(200).end();
};

export default handler;
