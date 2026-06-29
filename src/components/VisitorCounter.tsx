import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Only increment once per session to avoid artificial inflation
    const hasVisited = sessionStorage.getItem("wc_visited");
    
    const url = hasVisited 
      ? "https://api.counterapi.dev/v1/rustys-world-cup/hits"
      : "https://api.counterapi.dev/v1/rustys-world-cup/hits/up";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        if (!hasVisited) {
          sessionStorage.setItem("wc_visited", "true");
        }
      })
      .catch(() => {
        // Silently swallow fetch errors (likely adblocker blocking tracker domains)
      });
  }, []);

  if (count === null) {
    return null; // or a loading spinner, but silent is better for footer
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono tracking-widest font-bold uppercase bg-slate-800/50 px-2 py-1 rounded-sm border border-white/5">
      <Users className="w-3 h-3 text-yellow-500" />
      <span>{count.toLocaleString()} ZİYARETÇİ</span>
    </div>
  );
}
