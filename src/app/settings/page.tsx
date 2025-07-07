// src/app/settings/page.tsx
"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import AccountInfoCard from "@/components/settings/AccountInfoCard";
import PreferenceSettingsCard from "@/components/settings/PreferenceSettingsCard";
import AccountActionCard from "@/components/settings/AccountActionCard";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">설정</h1>
        </div>
        <AccountInfoCard />
        <PreferenceSettingsCard />
        <AccountActionCard />
      </div>
    </Layout>
  );
}
