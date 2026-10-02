"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function DataInitializer() {
  const { fetchInitialData } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return null;
}
