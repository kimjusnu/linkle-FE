// src/components/settings/PreferenceSettingsCard.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function PreferenceSettingsCard() {
  const { theme, setTheme } = useTheme();
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("notifyAlert");
    setNotify(stored === "true");
  }, []);

  const toggleNotify = () => {
    localStorage.setItem("notifyAlert", String(!notify));
    setNotify(!notify);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" /> 환경 설정
        </CardTitle>
        <CardDescription>앱의 테마 및 알림을 설정하세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm flex items-center gap-1">🌗 다크 모드</span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm flex items-center gap-1">
            🔔 마감 하루 전 알림
          </span>
          <Switch checked={notify} onCheckedChange={toggleNotify} />
        </div>
      </CardContent>
    </Card>
  );
}
