"use client"
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddEmployeeSheet } from "./AddEmployeeSheet";

export function AddEmployeeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size={"icon"}
        className="shrink-0 sm:w-auto h-9 w-9 sm:h-9 sm:px-3 bg-yellow-700 hover:bg-yellow-800 text-white shadow-md shadow-yellow-100 rounded-lg mt-1 sm:mt-0 self-start xl:self-auto"
      >
        <Plus className="w-4 h-4 sm:mr-1.5 shrink-0" />
        <span className="hidden sm:inline text-xs font-semibold">Thêm nhân viên</span>
      </Button>

      <AddEmployeeSheet
        open={isOpen} 
        onOpenChange={setIsOpen} 
        onSuccess={() => setIsOpen(false)} 
      />
    </>
  );
}