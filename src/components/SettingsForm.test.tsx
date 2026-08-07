// src/components/SettingsForm.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsForm from "./SettingsForm";

describe("SettingsForm", () => {
  it("submits valid data", async () => {
    const onSave = vi.fn();
    render(<SettingsForm onSave={onSave} />);

    await userEvent.type(screen.getByLabelText(/name/i), "Anas");
    await userEvent.type(screen.getByLabelText(/email/i), "anas@example.com");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith({
      name: "Anas",
      email: "anas@example.com",
      notifications: true,
    });
    expect(await screen.findByText(/settings saved/i)).toBeInTheDocument();
  });

  it("shows an error for an invalid email", async () => {
    render(<SettingsForm />);

    await userEvent.type(screen.getByLabelText(/name/i), "Anas");
    await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("shows an error when the required name field is empty", async () => {
    render(<SettingsForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "anas@example.com");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
  });
});
