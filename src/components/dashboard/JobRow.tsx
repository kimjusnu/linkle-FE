// ✅ JobRow.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import { toast } from "sonner";

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

const stepColors: Record<string, string> = {
  서류: "bg-gray-200 text-gray-800",
  과제: "bg-indigo-200 text-indigo-800",
  코테: "bg-violet-200 text-violet-800",
  "1차 면접": "bg-sky-200 text-sky-800",
  "2차 면접": "bg-blue-200 text-blue-800",
  "최종 면접": "bg-cyan-200 text-cyan-800",
  오퍼: "bg-emerald-200 text-emerald-800",
  합격: "bg-green-200 text-green-800",
  불합격: "bg-rose-200 text-rose-800",
};

const statuses = ["진행중", "합격", "불합격"];
const steps = Object.keys(stepColors);

const JobRow: React.FC<{
  job: Job;
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  onDelete: (id: string) => void;
}> = ({ job, onDelete }) => {
  const [status, setStatus] = useState(job.status);
  const [step, setStep] = useState(job.step);
  const [stepPopoverOpen, setStepPopoverOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    if (status !== job.status) {
      updateDoc(doc(db, "users", userId, "jobs", job.id), { status });
    }
  }, [status, job.id, job.status, userId]);

  useEffect(() => {
    if (!userId) return;
    if (step !== job.step) {
      updateDoc(doc(db, "users", userId, "jobs", job.id), { step });
    }
  }, [step, job.id, job.step, userId]);

  return (
    <TableRow ref={setNodeRef} style={style} className="text-center">
      <TableCell>
        <GripVertical
          className="w-4 h-4 mx-auto cursor-grab text-gray-400"
          {...attributes}
          {...listeners}
        />
      </TableCell>

      <TableCell>
        <span
          className={`block w-2 h-2 mx-auto rounded-full ${
            status === "합격"
              ? "bg-blue-400"
              : status === "불합격"
              ? "bg-red-400"
              : "bg-green-400"
          }`}
        />
      </TableCell>

      <TableCell>
        <Select value={status} onValueChange={(val) => setStatus(val)}>
          <SelectTrigger className="w-[100px] mx-auto">
            <SelectValue placeholder="진행상태" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <Popover open={stepPopoverOpen} onOpenChange={setStepPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`px-3 h-8 rounded-full text-sm ${stepColors[step]} cursor-pointer`}
            >
              {step}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-wrap gap-1 w-[300px] p-2">
            {steps.map((s) => (
              <Badge
                key={s}
                onClick={() => {
                  setStep(s);
                  setStepPopoverOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded-full transition cursor-pointer ${
                  step === s
                    ? stepColors[s]
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {s}
              </Badge>
            ))}
          </PopoverContent>
        </Popover>
      </TableCell>

      <TableCell className="max-w-[200px] truncate text-sm text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate cursor-[zoom-in]">{job.company}</div>
            </TooltipTrigger>
            <TooltipContent>{job.company}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      <TableCell>{job.experience}</TableCell>
      <TableCell>{job.deadline}</TableCell>
      <TableCell>{job.platform ?? "-"}</TableCell>
      <TableCell>{job.location ?? "-"}</TableCell>

      <TableCell>
        <a href={job.link} target="_blank" rel="noopener noreferrer">
          <Button size="icon" variant="ghost" className="cursor-pointer">
            🔗
          </Button>
        </a>
      </TableCell>

      <TableCell>
        <ConfirmDeleteModal
          trigger={
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          }
          onConfirm={() => {
            onDelete(job.id);
            toast.success("삭제되었습니다.");
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default JobRow;
