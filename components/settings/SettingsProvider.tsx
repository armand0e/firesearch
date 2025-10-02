"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type LLMProviderConfig = {
  provider: "openai" | "openrouter" | "together" | "custom";
  apiKey?: string;
  baseURL?: string;
  modelFast?: string;
  modelQuality?: string;
  streamUsage?: boolean; // disable when proxy doesn't support stream options
};

export type FirecrawlConfig = {
  apiKey?: string;
  apiUrl?: string; // e.g. https://api.firecrawl.dev
};

export type AppSettings = {
  llm: LLMProviderConfig;
  firecrawl: FirecrawlConfig;
};

const DEFAULT_SETTINGS: AppSettings = {
  llm: {
    provider: "openai",
    apiKey: "",
    baseURL: "", // official OpenAI default
    modelFast: "gpt-4o-mini",
    modelQuality: "gpt-4o",
    streamUsage: true,
  },
  firecrawl: {
    apiKey: "",
    apiUrl: "https://api.firecrawl.dev",
  },
};

const STORAGE_KEY = "firesearch:settings:v1";

type SettingsContextValue = {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  openSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // Also persist to cookie for server actions
      const cookieValue = encodeURIComponent(JSON.stringify(settings));
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `firesearch_settings=${cookieValue}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
    } catch {}
  }, [settings]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, setSettings, updateSettings, open, setOpen, openSettings: () => setOpen(true) }),
    [settings, open]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
      <SettingsDialog />
    </SettingsContext.Provider>
  );
}

export function SettingsButton({ className = "" }: { className?: string }) {
  const { openSettings } = useSettings();
  return (
    <Button type="button" variant="code" onClick={openSettings} className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.89 3.31.877 2.42 2.42a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.89 1.543-.877 3.31-2.42 2.42a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.89-3.31-.877-2.42-2.42a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.89-1.543.877-3.31 2.42-2.42.99.571 2.232.106 2.573-1.066z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Settings
    </Button>
  );
}

function SettingsDialog() {
  const { open, setOpen, settings, setSettings } = useSettings();

  const setProvider = (provider: LLMProviderConfig["provider"]) => {
    const baseByProvider: Record<string, string> = {
      openai: "",
      openrouter: "https://openrouter.ai/api/v1",
      together: "https://api.together.xyz/v1",
      custom: settings.llm.baseURL || "",
    };
    setSettings({
      ...settings,
      llm: { ...settings.llm, provider, baseURL: baseByProvider[provider] },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[620px] bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your LLM provider and Firecrawl endpoint.</DialogDescription>
        </DialogHeader>

        {/* LLM Provider */}
        <div className="space-y-3 mt-2">
          <h3 className="text-sm font-semibold">LLM Provider</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="llmProvider" className="text-xs text-gray-600 dark:text-gray-400">Provider</label>
              <select
                id="llmProvider"
                className="w-full h-10 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 text-sm"
                value={settings.llm.provider}
                onChange={(e) => setProvider(e.target.value as any)}
                aria-label="LLM provider"
              >
                <option value="openai">OpenAI</option>
                <option value="openrouter">OpenRouter (OpenAI compatible)</option>
                <option value="together">Together (OpenAI compatible)</option>
                <option value="custom">Custom OpenAI-compatible</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">Base URL</label>
              <Input
                value={settings.llm.baseURL || ""}
                onChange={(e) => setSettings({ ...settings, llm: { ...settings.llm, baseURL: e.target.value } })}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">API Key</label>
              <Input
                type="password"
                value={settings.llm.apiKey || ""}
                onChange={(e) => setSettings({ ...settings, llm: { ...settings.llm, apiKey: e.target.value } })}
                placeholder="sk-..."
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="streamUsage" className="text-xs text-gray-600 dark:text-gray-400">Disable stream usage metadata</label>
              <div className="flex items-center gap-2 h-10">
                <input
                  id="streamUsage"
                  type="checkbox"
                  checked={settings.llm.streamUsage === false ? false : true}
                  onChange={(e) => setSettings({ ...settings, llm: { ...settings.llm, streamUsage: e.target.checked } })}
                  aria-label="Toggle stream usage metadata"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">Uncheck if your proxy doesn't support stream_options</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">Fast model</label>
              <Input
                value={settings.llm.modelFast || ""}
                onChange={(e) => setSettings({ ...settings, llm: { ...settings.llm, modelFast: e.target.value } })}
                placeholder="gpt-4o-mini"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">Quality model</label>
              <Input
                value={settings.llm.modelQuality || ""}
                onChange={(e) => setSettings({ ...settings, llm: { ...settings.llm, modelQuality: e.target.value } })}
                placeholder="gpt-4o"
              />
            </div>
          </div>
        </div>

        {/* Firecrawl */}
        <div className="space-y-3 mt-6">
          <h3 className="text-sm font-semibold">Firecrawl</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">API URL</label>
              <Input
                value={settings.firecrawl.apiUrl || ""}
                onChange={(e) => setSettings({ ...settings, firecrawl: { ...settings.firecrawl, apiUrl: e.target.value } })}
                placeholder="https://api.firecrawl.dev"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">API Key</label>
              <Input
                type="password"
                value={settings.firecrawl.apiKey || ""}
                onChange={(e) => setSettings({ ...settings, firecrawl: { ...settings.firecrawl, apiKey: e.target.value } })}
                placeholder="fc-..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="code" onClick={() => setOpen(false)}>Close</Button>
          <Button variant="orange" onClick={() => setOpen(false)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
