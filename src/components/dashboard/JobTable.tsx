// ✅ JobTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import JobRow from "./JobRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

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
}

const JobTable: React.FC<{
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}> = ({ jobs, setJobs }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [newJob, setNewJob] = useState({
    company: "",
    experience: "",
    deadline: "",
    link: "",
    platform: "",
    location: "",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const userId = user.uid;
      const snapshot = await getDocs(collection(db, "users", userId, "jobs"));
      const fetched = snapshot.docs.map((doc) => doc.data() as Job);
      setJobs(fetched);
    });

    return () => unsubscribe();
  }, [setJobs]);

  const handleAddJob = async () => {
    const user = auth.currentUser;
    const userId = user?.uid;
    if (!userId || !newJob.company || !newJob.link) return;

    const newEntry: Job = {
      id: Date.now().toString(),
      status: "진행중",
      step: "서류",
      company: newJob.company,
      experience: newJob.experience,
      deadline: newJob.deadline,
      link: newJob.link,
      platform: newJob.platform ?? "직접입력",
      location: newJob.location ?? "",
    };

    try {
      await setDoc(doc(db, "users", userId, "jobs", newEntry.id), newEntry);
      setJobs((prev) => [...prev, newEntry]);
      setNewJob({
        company: "",
        experience: "",
        deadline: "",
        link: "",
        platform: "",
        location: "",
      });
    } catch (err) {
      console.error("❌ Firestore 저장 실패:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    const userId = user?.uid;
    if (!userId) return;

    try {
      await deleteDoc(doc(db, "users", userId, "jobs", id));
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("❌ Firestore 삭제 실패:", err);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = jobs.findIndex((j) => j.id === active.id);
      const newIndex = jobs.findIndex((j) => j.id === over?.id);
      setJobs(arrayMove(jobs, oldIndex, newIndex));
    }
  };

  return (
    <div className="rounded-lg border bg-white">
      <div className="flex flex-wrap gap-2 p-4 border-b items-end">
        <Input
          name="company"
          placeholder="기업명"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
          className="w-[160px]"
        />
        <Input
          name="experience"
          placeholder="경력조건"
          value={newJob.experience}
          onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
          className="w-[140px]"
        />
        <Input
          name="deadline"
          placeholder="마감일자 (예: 2025-07-15)"
          value={newJob.deadline}
          onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
          className="w-[160px]"
        />
        <Input
          name="platform"
          placeholder="플랫폼 (예: 원티드)"
          value={newJob.platform}
          onChange={(e) => setNewJob({ ...newJob, platform: e.target.value })}
          className="w-[120px]"
        />
        <Input
          name="location"
          placeholder="지역 (예: 서울 금천구)"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          className="w-[120px]"
        />
        <Input
          name="link"
          placeholder="공고 링크"
          value={newJob.link}
          onChange={(e) => setNewJob({ ...newJob, link: e.target.value })}
          className="flex-1 min-w-[200px]"
        />
        <Button
          onClick={handleAddJob}
          className="flex gap-1 items-center cursor-pointer"
        >
          <Plus className="w-4 h-4" /> 수동 추가
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={jobs.map((job) => job.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-[40px] text-center"></TableHead>
                <TableHead className="w-[16px] text-center"></TableHead>
                <TableHead className="w-[100px] text-center">
                  진행상태
                </TableHead>
                <TableHead className="w-[120px] text-center">
                  진행단계
                </TableHead>
                <TableHead className="text-center">기업명</TableHead>
                <TableHead className="text-center">경력조건</TableHead>
                <TableHead className="text-center">마감일자</TableHead>
                <TableHead className="text-center">플랫폼</TableHead>
                <TableHead className="text-center">지역</TableHead>
                <TableHead className="text-center">공고 링크</TableHead>
                <TableHead className="text-center">삭제</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  setJobs={setJobs}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default JobTable;
