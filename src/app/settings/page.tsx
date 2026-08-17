"use client";

import { Settings, User, Key, Bell, Shield, ChevronRight } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const settingsSchema = z.object({
  displayName: z.string().min(1, "Name is required").max(50),
  tmdbApiKey: z.string().optional(),
  geminiApiKey: z.string().optional(),
  avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const SETTING_SECTIONS = [
  { icon: User,    label: "Profile",       id: "profile"    },
  { icon: Key,     label: "API Keys",      id: "api"        },
  { icon: Bell,    label: "Notifications", id: "notifs",    disabled: true },
  { icon: Shield,  label: "Privacy",       id: "privacy",   disabled: true },
];

export default function SettingsPage() {
  const { settings, updateSettings, isLoaded } = useSettings();
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { displayName: "", tmdbApiKey: "", geminiApiKey: "", avatarUrl: "" },
  });

  // Populate form once settings load from localStorage
  useEffect(() => {
    if (isLoaded) {
      reset({
        displayName: settings.displayName,
        tmdbApiKey:  settings.tmdbApiKey ?? "",
        geminiApiKey: settings.geminiApiKey ?? "",
        avatarUrl:   settings.avatarUrl  ?? "",
      });
    }
  }, [isLoaded, settings, reset]);

  const onSubmit = (data: SettingsForm) => {
    updateSettings({
      displayName: data.displayName,
      tmdbApiKey:  data.tmdbApiKey  || undefined,
      geminiApiKey: data.geminiApiKey || undefined,
      avatarUrl:   data.avatarUrl   || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-zinc-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
          <Settings className="h-6 w-6 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Settings</h1>
          <p className="text-zinc-500 text-sm">Manage your profile and API key configuration.</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="hidden md:flex flex-col gap-1 w-44 shrink-0">
          {SETTING_SECTIONS.map(({ icon: Icon, label, id, disabled }) => (
            <button
              key={id}
              onClick={() => !disabled && setActiveSection(id)}
              disabled={disabled}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                activeSection === id
                  ? "bg-zinc-800 text-white"
                  : disabled
                  ? "text-zinc-700 cursor-not-allowed"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {disabled && <span className="ml-auto text-[10px] text-zinc-700 font-bold">SOON</span>}
            </button>
          ))}
        </nav>

        {/* Form panel */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Profile section */}
            {activeSection === "profile" && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-600">Profile</h2>

                {/* Avatar preview */}
                <div className="flex items-center gap-5 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.avatarUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"}
                    alt="Avatar"
                    className="h-16 w-16 rounded-xl border border-zinc-700 object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold">{settings.displayName}</p>
                    <p className="text-zinc-500 text-xs">Update your avatar URL below</p>
                  </div>
                </div>

                <FieldGroup label="Display name" error={errors.displayName?.message}>
                  <input
                    id="displayName"
                    {...register("displayName")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
                    placeholder="Your name"
                  />
                </FieldGroup>

                <FieldGroup label="Avatar URL" error={errors.avatarUrl?.message}>
                  <input
                    id="avatarUrl"
                    {...register("avatarUrl")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition"
                    placeholder="https://example.com/avatar.png"
                  />
                </FieldGroup>
              </section>
            )}

            {/* API Keys section */}
            {activeSection === "api" && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-600">API Keys</h2>

                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-300 text-xs flex gap-2">
                  <Key className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Keys are stored <strong>only in your browser</strong> (localStorage). They are never sent to any server.</span>
                </div>

                <FieldGroup label="TMDB API Key (v3)" error={errors.tmdbApiKey?.message}>
                  <input
                    id="tmdbApiKey"
                    type="password"
                    {...register("tmdbApiKey")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition font-mono"
                    placeholder="Paste your TMDB v3 API key (e.g. dcc275f...)"
                  />
                </FieldGroup>

                <FieldGroup label="Gemini API Key" error={errors.geminiApiKey?.message}>
                  <input
                    id="geminiApiKey"
                    type="password"
                    {...register("geminiApiKey")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition font-mono"
                    placeholder="Paste your Google Gemini API key (e.g. AIzaSy...)"
                  />
                </FieldGroup>

                <p className="text-xs text-zinc-600 leading-normal">
                  • TMDB keys are free at{" "}
                  <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline hover:text-amber-400">
                    themoviedb.org/settings/api
                  </a>
                  <br />
                  • Gemini keys are free at{" "}
                  <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-amber-500 underline hover:text-amber-400">
                    aistudio.google.com
                  </a>
                </p>
              </section>
            )}

            {/* Save button */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={!isDirty}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-bold transition"
              >
                Save Changes
              </button>
              {saved && (
                <span className="text-emerald-400 text-sm font-medium animate-fade-in">
                  ✓ Saved!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Small helper to reduce repetition
function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-zinc-300">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
