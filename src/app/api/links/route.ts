// app/api/links/route.ts
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// GET: 전체 링크 조회
export async function GET() {
  try {
    const snapshot = await adminDb.collection("links").get();
    const links = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(links);
  } catch (error) {
    console.error("GET /api/links 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
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

  try {
    const docRef = await adminDb.collection("links").add({
      userId,
      url,
      title: title || "",
      status: status || "ACTIVE",
      stage: stage || "APPLIED",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/links 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
