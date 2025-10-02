"use client";

import React from "react";
import { SettingsProvider } from "@/components/settings/SettingsProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>;
}
