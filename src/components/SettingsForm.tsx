// src/components/SettingsForm.tsx
// ROUND 2 — output from the precise, spec'd prompt (file reference, constraints,
// verification step). New deps used: react-hook-form, @hookform/resolvers, zod —
// flagging per CLAUDE.md's "no silent new dependencies" rule.

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormValues } from "@/lib/validation/settingsSchema";

interface SettingsFormProps {
  onSave?: (values: SettingsFormValues) => Promise<void> | void;
}

export default function SettingsForm({ onSave }: SettingsFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { name: "", email: "", notifications: true },
  });

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      await onSave?.(values);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notifications">Enable notifications</label>
        <input id="notifications" type="checkbox" {...register("notifications")} />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save"}
      </button>

      {status === "success" && <p role="status">Settings saved.</p>}
      {status === "error" && <p role="alert">Something went wrong. Please try again.</p>}
    </form>
  );
}
