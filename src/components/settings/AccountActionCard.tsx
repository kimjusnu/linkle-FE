"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { KeyRound, LogOut, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { deleteUser, sendPasswordResetEmail } from "firebase/auth";
import { deleteCookie } from "cookies-next";

export default function AccountActionCard() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleResetPassword = async () => {
    if (user?.email) {
      await sendPasswordResetEmail(auth, user.email);
      alert("비밀번호 재설정 메일을 보냈습니다.");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    deleteCookie("token");
    router.push("/login");
  };

  const handleDelete = async () => {
    if (user) {
      try {
        await deleteUser(user);
        deleteCookie("token");
        router.push("/signup");
      } catch {
        alert("삭제 실패: 최근 로그인 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="w-5 h-5" /> 계정 제어
        </CardTitle>
        <CardDescription>
          계정을 관리하고 로그아웃/탈퇴할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleResetPassword}
        >
          <KeyRound className="w-4 h-4" /> 비밀번호 재설정
        </Button>
        <Button
          variant="secondary"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> 로그아웃
        </Button>

        {/* 🔐 탈퇴 확인 모달 */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full justify-start gap-2"
            >
              <Trash2 className="w-4 h-4" /> 회원 탈퇴
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말로 탈퇴하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                이 작업은 되돌릴 수 없습니다. 모든 데이터가 삭제되며, 다시
                복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                탈퇴하기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
