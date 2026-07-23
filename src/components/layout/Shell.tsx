import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="flex min-h-screen bg-background text-foreground font-sans dark">
      <Sidebar />
      <div className="flex-1 flex flex-col mr-[282px]">
        <Topbar />
        <main className="flex-1 p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
