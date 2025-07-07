"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import LinkForm from "@/components/dashboard/LinkForm";
import JobTable from "@/components/dashboard/JobTable";

interface Job {
  id: string;
  status: string;
  step: string;
  company: string;
  experience: string;
  deadline: string;
  link: string;
  resumeUrl?: string;
}

const DashboardPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          📌 내 지원 현황
        </h2>
        <LinkForm setJobs={setJobs} />
        <JobTable jobs={jobs} setJobs={setJobs} />
      </div>
    </Layout>
  );
};

export default DashboardPage;
