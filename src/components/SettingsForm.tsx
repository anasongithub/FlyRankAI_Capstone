// src/components/SettingsForm.tsx
// ROUND 1 — output from the vague prompt: "Build me a settings form for this app."
// Committed as-is, no hand fixes, per the FE-04 brief.

import { useState } from "react";

export default function SettingsForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({ name, email, notifications });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input
        type="checkbox"
        checked={notifications}
        onChange={(e) => setNotifications(e.target.checked)}
      />
      <button type="submit">Save</button>
    </form>
  );
}
