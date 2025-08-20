export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = (await req.json()) as { userId?: string };
    if (!userId) {
      return NextResponse.json({ message: "invalid body" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebaseAdmin");
    if (!adminDb) {
      return NextResponse.json(
        { message: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    await adminDb
      .collection("users")
      .doc(userId)
      .collection("jobs")
      .doc(resolvedParams.id)
      .delete();

    return NextResponse.json({ ok: true }, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/user-jobs/[id] 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, update } = (await req.json()) as {
      userId?: string;
      update?: Record<string, unknown>;
    };
    if (!userId || !update) {
      return NextResponse.json({ message: "invalid body" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebaseAdmin");
    if (!adminDb) {
      return NextResponse.json(
        { message: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    await adminDb
      .collection("users")
      .doc(userId)
      .collection("jobs")
      .doc(resolvedParams.id)
      .update({ ...update });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/user-jobs/[id] 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
