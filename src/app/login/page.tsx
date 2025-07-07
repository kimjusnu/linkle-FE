"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { setCookie } from "cookies-next";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      // ✅ 사용자 정보 콘솔 출력
      console.log("✅ 사용자 정보:");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);
      console.log("Display Name:", user.displayName);
      console.log("Photo URL:", user.photoURL);
      console.log("Access Token:", token);

      // ✅ 쿠키에 토큰 저장
      setCookie("token", token, {
        maxAge: 60 * 60 * 24, // 1일
        path: "/",
      });

      toast.success("로그인 성공!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/invalid-login-credentials":
          case "auth/invalid-credential":
            setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
            break;
          case "auth/wrong-password":
            setErrorMsg("비밀번호가 올바르지 않습니다.");
            break;
          case "auth/invalid-email":
            setErrorMsg("이메일 형식이 올바르지 않습니다.");
            break;
          case "auth/user-disabled":
            setErrorMsg("비활성화된 계정입니다. 관리자에게 문의하세요.");
            break;
          case "auth/too-many-requests":
            setErrorMsg(
              "너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요."
            );
            break;
          default:
            setErrorMsg(`로그인 실패: ${err.message}`);
        }
      } else {
        setErrorMsg("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // ✅ 사용자 정보 콘솔 출력
      console.log("✅ Google 사용자 정보:");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);
      console.log("Display Name:", user.displayName);
      console.log("Photo URL:", user.photoURL);
      console.log("Access Token:", token);

      // ✅ 쿠키에 저장
      setCookie("token", token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      toast.success("Google 로그인 성공!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setErrorMsg(`Google 로그인 오류: ${err.message}`);
      } else {
        setErrorMsg("Google 로그인 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          환영합니다
        </h2>

        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
        >
          <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
          Google로 계속하기
        </Button>

        <div className="border-t border-gray-300" />

        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-600 font-medium">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            placeholder="diln@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 bg-gray-100 focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-gray-600 font-medium">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 bg-gray-100 focus:border-green-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md shadow-sm transition cursor-pointer"
        >
          로그인
        </Button>

        <p className="text-center text-sm text-gray-500">
          계정이 없으신가요?{" "}
          <a href="/signup" className="text-green-500 hover:underline">
            회원가입
          </a>
        </p>
      </form>
    </div>
  );
}
