"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { DotSpinner } from "@/components/ui/dot-spinner"; // ✅ 추가

const PUBLIC_ROUTES = ["/", "/login", "/signup"]; // ✅ "/" 추가

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isPublic = PUBLIC_ROUTES.includes(pathname ?? "");
    const token = getCookie("token");

    if (!token && !isPublic) {
      console.log("🔥 로그인 토큰이 없습니다. 로그인 페이지로 이동합니다.");
      setChecking(false);
      router.replace("/login");
      return;
    }

    if (token) {
      console.log("🔥 로그인 토큰이 확인되었습니다:", token);
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <DotSpinner />
          <p className="text-gray-500 text-sm">페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
