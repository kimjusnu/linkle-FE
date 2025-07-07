import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r h-full p-6 space-y-4">
      <h1 className="text-xl font-bold">🔗 Diln</h1>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="w-full cursor-pointer justify-start"
          >
            내 대시보드
          </Button>
        </Link>

        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full cursor-pointer justify-start"
          >
            설정
          </Button>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
