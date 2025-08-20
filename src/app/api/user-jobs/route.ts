export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

interface Job {
  id: string;
  status: string;
  step: string;
  company: string;
  experience: string;
  deadline: string;
  link: string;
  platform?: string;
  location?: string;
  resumeUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, job } = (await req.json()) as {
      userId?: string;
      job?: Job;
    };
    if (!userId || !job || !job.id) {
      return NextResponse.json({ message: "invalid body" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebaseAdmin");
    if (!adminDb) {
      return NextResponse.json(
        { message: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("jobs")
      .doc(job.id)
      .set(job);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/user-jobs 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ message: "missing userId" }, { status: 400 });
    }

    const { adminDb } = await import("@/lib/firebaseAdmin");
    if (!adminDb) {
      return NextResponse.json(
        { message: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    const snapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("jobs")
      .get();

    const jobs = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Job, "id">),
    }));
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("GET /api/user-jobs 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
