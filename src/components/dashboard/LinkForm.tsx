// ✅ LinkForm.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

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

const LinkForm: React.FC<{
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}> = ({ setJobs }) => {
  const [url, setUrl] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (url: string) => {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("로그인이 필요합니다.");
      const res = await axios.post("/api/links", { url, userId });
      return res.data;
    },
    onSuccess: async (_, url) => {
      try {
        const metaRes = await axios.post("/api/fetch-meta", { url });
        const meta = metaRes.data;
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("로그인이 필요합니다.");

        const newJob: Job = {
          id: Date.now().toString(),
          status: "진행중",
          step: "서류",
          company: meta.company || "알 수 없음",
          experience: meta.experience || "-",
          deadline: meta.deadline || "-",
          link: meta.url || url,
          platform: meta.platform || meta.source || "직접입력",
          location: meta.location || "-",
        };

        await setDoc(doc(db, "users", userId, "jobs", newJob.id), newJob);
        setJobs((prev) => [...prev, newJob]);
        toast.success("링크가 등록되었습니다!");
        setUrl("");
      } catch {
        toast.error("메타데이터 분석 또는 저장 실패");
      }
    },
    onError: (error) => {
      toast.error("등록 실패: " + (error as Error).message);
    },
  });

  const handleSubmit = () => {
    if (!url) {
      toast.error("URL을 입력해주세요.");
      return;
    }
    mutate(url);
  };

  return (
    <div className="flex gap-4 items-center">
      <Input
        type="url"
        placeholder="공고 링크를 입력하세요"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1"
      />
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="flex items-center gap-2 justify-center min-w-[96px]"
      >
        {isPending ? (
          <>
            <LoadingSpinner size={18} />
            <span>등록 중</span>
          </>
        ) : (
          "등록"
        )}
      </Button>
    </div>
  );
};

export default LinkForm;
