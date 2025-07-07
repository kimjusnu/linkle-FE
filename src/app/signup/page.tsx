"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image"; // 추가

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);

  const isFormValid = isEmailValid && isPasswordValid && doPasswordsMatch;

  useEffect(() => {
    setIsEmailValid(/^\S+@\S+\.\S+$/.test(email));
  }, [email]);

  useEffect(() => {
    const pattern = /^(?=.*[!@#$%^&*()?])[A-Za-z\d!@#$%^&*()?]{6,}$/;
    setIsPasswordValid(pattern.test(password));
  }, [password]);

  useEffect(() => {
    setDoPasswordsMatch(password !== "" && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    if (!isFormValid) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("회원가입 성공! 2초 후 로그인 페이지로 이동합니다.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setErrorMsg("이미 사용 중인 이메일입니다.");
            break;
          case "auth/invalid-email":
            setErrorMsg("유효한 이메일 주소를 입력해주세요.");
            break;
          case "auth/weak-password":
            setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다.");
            break;
          default:
            setErrorMsg(`회원가입 실패: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setErrorMsg(`회원가입 실패: ${err.message}`);
      } else {
        setErrorMsg("회원가입 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google 로그인 성공!");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setErrorMsg(`Google 로그인 오류: ${err.message}`);
      } else if (err instanceof Error) {
        setErrorMsg(`Google 로그인 실패: ${err.message}`);
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
          회원가입
        </h2>

        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        {/* Google 로그인 버튼 */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline"
          className="cursor-pointer w-full flex items-center justify-center gap-2"
        >
          <Image src="/google-logo.svg" alt="Google" width={20} height={20} />
          Google로 계속하기
        </Button>

        <div className="border-t border-gray-300" />

        {/* 이메일 입력 */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-gray-600 font-medium">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            placeholder="diln@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border ${
              isEmailValid ? "border-green-400" : "border-red-300"
            } bg-gray-100 focus:border-green-500`}
          />
          {!isEmailValid && email !== "" && (
            <p className="text-red-400 text-sm">
              유효한 이메일을 입력해주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-gray-600 font-medium">
            비밀번호 (6자 이상, 특수문자 포함)
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border ${
              isPasswordValid ? "border-green-400" : "border-red-300"
            } bg-gray-100 focus:border-green-500`}
          />
          {!isPasswordValid && password !== "" && (
            <p className="text-red-400 text-sm">
              비밀번호는 6자 이상이며, 특수문자(!@#$%^&*()?)를 포함해야 합니다.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-600 font-medium"
          >
            비밀번호 확인
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`border ${
              doPasswordsMatch ? "border-green-400" : "border-red-300"
            } bg-gray-100 focus:border-green-500`}
          />
          {!doPasswordsMatch && confirmPassword !== "" && (
            <p className="text-red-400 text-sm">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* 가입하기 버튼 */}
        <Button
          type="submit"
          disabled={!isFormValid}
          className={`w-full font-semibold py-2 rounded-md shadow-sm transition ${
            isFormValid
              ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          가입하기
        </Button>

        <p className="text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            로그인
          </a>
        </p>
      </form>
    </div>
  );
}
