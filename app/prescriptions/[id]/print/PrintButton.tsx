"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button variant="default" size="sm" onClick={handlePrint}>
      <Printer className="w-4 h-4 mr-2" />
      Print / Save as PDF
    </Button>
  );
}
