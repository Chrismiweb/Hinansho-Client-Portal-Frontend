"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      } else {
        setChecked(true);
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  if (!checked) return null;

  return <>{children}</>;
}
