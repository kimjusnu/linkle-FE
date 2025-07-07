"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AccountInfoCard() {
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
        setCreatedAt(user.metadata.creationTime || "");
        setProvider(user.providerData[0]?.providerId || "");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User2 className="w-5 h-5" /> 내 계정 정보
        </CardTitle>
        <CardDescription>회원 기본 정보입니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>📧 이메일: {email || "불러오는 중..."}</p>
        <p>📅 가입일: {createdAt || "불러오는 중..."}</p>
        <p>🔐 로그인 방식: {provider || "불러오는 중..."}</p>
      </CardContent>
    </Card>
  );
}
