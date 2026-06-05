"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/authStorage";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const token = getAuthToken(); // always read from the single source of truth
      if (!token) {
        router.replace("/login");
      } else {
        setChecked(true);
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FB]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DDA04E] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
