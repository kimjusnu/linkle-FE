"use client";

import React, { useState } from "react";
import LinkForm from "./LinkForm";
import JobTable from "./JobTable";

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

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]); // ✅ 상태 선언

  return (
    <div className="space-y-6">
      <LinkForm setJobs={setJobs} /> {/* ✅ props 전달 */}
      <JobTable jobs={jobs} setJobs={setJobs} /> {/* ✅ props 전달 */}
    </div>
  );
}
