export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = (await req.json()) as { userId?: string };
    if (!userId) {
      return NextResponse.json({ message: "invalid body" }, { status: 400 });
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("jobs")
      .doc(params.id)
      .delete();

    return NextResponse.json({ ok: true }, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/user-jobs/[id] 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, update } = (await req.json()) as {
      userId?: string;
      update?: Record<string, unknown>;
    };
    if (!userId || !update) {
      return NextResponse.json({ message: "invalid body" }, { status: 400 });
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("jobs")
      .doc(params.id)
      .update({ ...update });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/user-jobs/[id] 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
