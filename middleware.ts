import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebaseAdmin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("🛡️ middleware 실행됨");
  console.log("🔹 요청 경로:", pathname);
  console.log("🔹 token 존재 여부:", !!token);

  const protectedPaths = ["/dashboard", "/settings"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  console.log("🔹 보호 경로 여부:", isProtected);

  if (isProtected) {
    if (!token) {
      console.log("🚫 보호 경로 접근 + 토큰 없음 → /login 으로 리디렉트");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = await getAuth(adminApp).verifyIdToken(token);
      console.log("✅ 토큰 검증 성공:", decoded.uid);
      return NextResponse.next();
    } catch (error) {
      console.log("❌ 토큰 검증 실패:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 로그인/회원가입 페이지 접근 시
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  console.log("🔹 로그인/회원가입 페이지 여부:", isAuthPage);

  if (isAuthPage && token) {
    try {
      await getAuth(adminApp).verifyIdToken(token);
      console.log("🔁 이미 로그인 상태 → /dashboard로 리디렉트");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch {
      console.log("⚠️ 토큰 검증 실패 → 로그인 페이지 허용");
      return NextResponse.next();
    }
  }

  console.log("➡️ 보호 경로 아님 → 그대로 진행");
  return NextResponse.next();
}

// 꼭 존재해야 함
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
  runtime: "nodejs",
};
