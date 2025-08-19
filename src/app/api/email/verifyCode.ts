// 예시: pages/api/email/verify-code.ts
import type { NextApiHandler } from "next";
import { getCode, deleteCode } from "@/lib/otpStore";

const handler: NextApiHandler = async (req, res) => {
  const { email, code } = req.body;
  const valid = (await getCode(email)) === code;
  if (valid) {
    await deleteCode(email);
    res.status(200).json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
};

export default handler;
