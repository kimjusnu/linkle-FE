"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export function useAuthGuard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      console.log("🔥 로그인 토큰이 없습니다. 로그인 페이지로 이동합니다.");
      setChecking(false);
      router.replace("/login");
      return;
    }

    console.log("🔥 로그인 토큰이 확인되었습니다:", token);
    setChecking(false);
  }, [router]);

  return { checking };
}
