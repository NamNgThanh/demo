"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock as ClockIcon } from "lucide-react";

export function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const dayName = days[currentTime.getDay()];
  const day = currentTime.getDate().toString().padStart(2, "0");
  const month = (currentTime.getMonth() + 1).toString().padStart(2, "0");
  const year = currentTime.getFullYear();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");

  return (
    <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-linear-to-r from-amber-50/80 to-orange-50/80 border border-amber-100/60 rounded-full text-[13px] font-medium text-slate-600 shadow-sm">
      <div className="flex items-center gap-1.5 text-amber-900/80">
        <Calendar className="h-4 w-4" />
        <span>{`${dayName}, ${day}/${month}/${year}`}</span>
      </div>
      <span className="text-amber-200/80">|</span>
      <div className="flex items-center gap-1.5 text-amber-900/80">
        <ClockIcon className="h-4 w-4" />
        <span>{`${hours}:${minutes}`}</span>
      </div>
    </div>
  );
}