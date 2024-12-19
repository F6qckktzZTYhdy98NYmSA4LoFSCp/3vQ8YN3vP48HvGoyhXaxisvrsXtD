import React from "react";
import { Toaster } from "../ui/toaster";
import { ToastProvider } from "../ui/toast";

export const AppLayout = ( children: React.ReactNode) => {
  return (
    <ToastProvider>
      <div className="min-h-screen w-screen flex items-center justify-center p-4">
        <div className="w-[1440px] h-[900px] bg-white/[0.97] rounded-3xl shadow-2xl relative backdrop-blur-sm overflow-hidden">
          {children}
        </div>
      </div>
      <Toaster />
    </ToastProvider>
  );
};
