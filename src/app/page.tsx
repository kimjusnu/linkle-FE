// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard"); // 로그인 후 이동할 실제 보호된 페이지
  }, [router]);

  return null;
}
