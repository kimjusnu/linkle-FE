// src/app/api/links/[id]/route.ts

import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// 🔸 수정할 수 있는 필드 타입 정의
interface LinkData {
  title: string;
  url: string;
  status: string;
  stage: string;
  resumeUrl?: string; // ✅ 추가됨
  updatedAt: Date;
}

// PUT: 링크 수정
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const { title, url, status, stage, resumeUrl } = body; // ✅ resumeUrl 포함

  // 🔸 수정 대상 데이터 생성
  const updateData: Partial<LinkData> = {
    updatedAt: new Date(),
  };

  if (title !== undefined) updateData.title = title;
  if (url !== undefined) updateData.url = url;
  if (status !== undefined) updateData.status = status;
  if (stage !== undefined) updateData.stage = stage;
  if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl; // ✅ resumeUrl 반영

  try {
    await updateDoc(doc(db, "links", id), updateData);
    return NextResponse.json({ message: "링크 수정 완료" });
  } catch (error) {
    console.error("Firestore 업데이트 실패:", error);
    return NextResponse.json(
      { message: "업데이트 실패", error },
      { status: 500 }
    );
  }
}

// DELETE: 링크 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await deleteDoc(doc(db, "links", id));
    return NextResponse.json({ message: "링크 삭제 완료" }, { status: 204 });
  } catch (error) {
    console.error("링크 삭제 실패:", error);
    return NextResponse.json({ message: "삭제 실패", error }, { status: 500 });
  }
}
