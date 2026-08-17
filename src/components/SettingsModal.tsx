"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Check, Save, User, Key, Bell, HelpCircle } from "lucide-react";
import { UserSettings } from "../types/movie";

// Zod Validation Schema
const settingsSchema = z.object({
  displayName: z
    .string()
    .min(3, { message: "Display name must be at least 3 characters." })
    .max(20, { message: "Display name must not exceed 20 characters." }),
  avatarUrl: z.string().url({ message: "Avatar must be a valid URL." }),
  tmdbApiKey: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 32, {
      message: "TMDB API Keys are usually 32 characters long.",
    }),
  notificationsEnabled: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsModalProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  { name: "Felix", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" },
  { name: "Aneka", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka" },
  { name: "Buster", url: "https://api.dicebear.com/7.x/big-ears/svg?seed=Buster" },
  { name: "Coco", url: "https://api.dicebear.com/7.x/big-ears/svg?seed=Coco" },
];

export default function SettingsModal({
  settings,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [success, setSuccess] = useState(false);

  // react-hook-form initialization with zodResolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: settings.displayName,
      avatarUrl: settings.avatarUrl,
      tmdbApiKey: settings.tmdbApiKey || "",
      notificationsEnabled: settings.notificationsEnabled,
    },
  });

  const selectedAvatar = watch("avatarUrl");

  const onSubmit = async (data: SettingsFormValues) => {
    setSuccess(false);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSave({
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      tmdbApiKey: data.tmdbApiKey || "",
      notificationsEnabled: data.notificationsEnabled,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            User Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold animate-pulse">
              <Check className="h-4 w-4" />
              Settings saved successfully! Closing...
            </div>
          )}

          {/* 1. Avatar selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Avatar</span>
            <div className="flex justify-between gap-3 p-3 bg-zinc-950/40 border border-zinc-800/80 rounded-xl">
              {AVATAR_OPTIONS.map((avatar) => {
                const active = selectedAvatar === avatar.url;
                return (
                  <button
                    key={avatar.name}
                    type="button"
                    onClick={() => setValue("avatarUrl", avatar.url)}
                    className={`relative p-1 rounded-xl border-2 transition-all ${
                      active
                        ? "border-amber-500 bg-amber-500/5 scale-105"
                        : "border-transparent bg-zinc-900 hover:border-zinc-700"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    {active && (
                      <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 text-black shadow">
                        <Check className="h-2.5 w-2.5 stroke-[4px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Display Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="displayName-input" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Display Name
            </label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                id="displayName-input"
                {...register("displayName")}
                className="w-full bg-zinc-950/70 border border-zinc-800 text-zinc-150 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/20 text-sm placeholder:text-zinc-600 transition"
                placeholder="Enter display name"
              />
            </div>
            {errors.displayName && (
              <span className="text-xs text-rose-400 font-medium pl-1">{errors.displayName.message}</span>
            )}
          </div>

          {/* 3. TMDB API Key */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="tmdbApiKey-input" className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                TMDB API Key <span className="text-[10px] text-zinc-500 lowercase">(optional)</span>
              </label>
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-amber-500 hover:underline flex items-center gap-0.5"
              >
                <HelpCircle className="h-3 w-3" /> Get API Key
              </a>
            </div>
            <div className="relative group">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="password"
                id="tmdbApiKey-input"
                {...register("tmdbApiKey")}
                className="w-full bg-zinc-950/70 border border-zinc-800 text-zinc-150 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/20 text-sm placeholder:text-zinc-600 transition"
                placeholder="Enter 32-character API key"
              />
            </div>
            <p className="text-[10px] text-zinc-500 pl-1">
              Supply a TMDB API Key to activate live movie searches, trending carousels, and recommendations!
            </p>
            {errors.tmdbApiKey && (
              <span className="text-xs text-rose-400 font-medium pl-1">{errors.tmdbApiKey.message}</span>
            )}
          </div>

          {/* 4. Notifications Toggle */}
          <div className="flex items-center justify-between bg-zinc-950/40 p-4 border border-zinc-800/80 rounded-xl">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-zinc-500 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-200">Email Notifications</span>
                <span className="text-xs text-zinc-500">Get digests of trending movies and releases.</span>
              </div>
            </div>
            <label htmlFor="notificationsEnabled-checkbox" className="sr-only">Enable Email Notifications</label>
            <input
              type="checkbox"
              id="notificationsEnabled-checkbox"
              {...register("notificationsEnabled")}
              className="h-4.5 w-4.5 bg-zinc-950 border border-zinc-800 text-amber-500 rounded focus:ring-amber-500/20 cursor-pointer"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 border-t border-zinc-800/50 pt-5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-black disabled:text-zinc-400 font-semibold text-xs transition shadow-lg shadow-amber-500/10 active:scale-98"
            >
              <Save className="h-3.5 w-3.5" />
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
