// app/api/links/route.ts
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET: 전체 링크 조회
export async function GET() {
  const snapshot = await getDocs(collection(db, "links"));
  const links = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(links);
}

// POST: 새 링크 추가
export async function POST(req: Request) {
  const body = await req.json();
  const { userId, url, title, status, stage } = body;

  if (!userId || !url) {
    return NextResponse.json(
      { message: "userId와 url은 필수입니다" },
      { status: 400 }
    );
  }

  const newDoc = await addDoc(collection(db, "links"), {
    userId,
    url,
    title: title || "",
    status: status || "ACTIVE",
    stage: stage || "APPLIED",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ id: newDoc.id }, { status: 201 });
}
