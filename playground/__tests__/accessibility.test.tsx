import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "../components/Modal";
import { Tabs } from "../components/Tabs";
import { Disclosure } from "../components/Disclosure";

describe("FE-05 Accessible Components Suite", () => {
  describe("Modal Component (W3C Dialog Pattern)", () => {
    it("renders with correct ARIA roles and attributes when open", () => {
      render(
        <Modal
          isOpen={true}
          onClose={() => {}}
          title="Test Modal Title"
          description="Test Modal Description"
        >
          <button type="button">Inside Button</button>
        </Modal>
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog.getAttribute("aria-modal")).toBe("true");
      expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
      expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
      expect(screen.getByText("Test Modal Title")).not.toBeNull();
      expect(screen.getByText("Test Modal Description")).not.toBeNull();
    });

    it("does not render when isOpen is false", () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Closed Modal">
          <p>Hidden Content</p>
        </Modal>
      );

      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("calls onClose when Escape key is pressed", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Escape Test">
          <button type="button">Interactive</button>
        </Modal>
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Tabs Component (W3C Tabs Pattern & Roving Tabindex)", () => {
    const mockTabs = [
      { id: "tab1", label: "Overview", content: <div>Overview Content</div> },
      { id: "tab2", label: "Features", content: <div>Features Content</div> },
      { id: "tab3", label: "Pricing", content: <div>Pricing Content</div> },
    ];

    it("renders tablist with correct initial roving tabIndex", () => {
      render(<Tabs tabs={mockTabs} ariaLabel="Test tabs" />);

      const tablist = screen.getByRole("tablist", { name: "Test tabs" });
      expect(tablist).not.toBeNull();

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);

      // First tab active: aria-selected="true" & tabIndex=0
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[0].getAttribute("tabindex")).toBe("0");

      // Inactive tabs: aria-selected="false" & tabIndex=-1
      expect(tabs[1].getAttribute("aria-selected")).toBe("false");
      expect(tabs[1].getAttribute("tabindex")).toBe("-1");
      expect(tabs[2].getAttribute("aria-selected")).toBe("false");
      expect(tabs[2].getAttribute("tabindex")).toBe("-1");

      // Initial panel content
      expect(screen.getByRole("tabpanel").textContent).toContain("Overview Content");
    });

    it("navigates tabs using ArrowRight and ArrowLeft keyboard keys", () => {
      render(<Tabs tabs={mockTabs} />);

      const tabs = screen.getAllByRole("tab");
      const tablist = screen.getByRole("tablist");

      // Press ArrowRight to move from Tab 1 -> Tab 2
      fireEvent.keyDown(tablist, { key: "ArrowRight" });

      expect(tabs[1].getAttribute("aria-selected")).toBe("true");
      expect(tabs[1].getAttribute("tabindex")).toBe("0");
      expect(tabs[0].getAttribute("aria-selected")).toBe("false");
      expect(screen.getByRole("tabpanel").textContent).toContain("Features Content");

      // Press ArrowLeft to move from Tab 2 -> Tab 1
      fireEvent.keyDown(tablist, { key: "ArrowLeft" });

      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[0].getAttribute("tabindex")).toBe("0");
      expect(screen.getByRole("tabpanel").textContent).toContain("Overview Content");
    });

    it("navigates to first and last tab using Home and End keys", () => {
      render(<Tabs tabs={mockTabs} />);

      const tabs = screen.getAllByRole("tab");
      const tablist = screen.getByRole("tablist");

      // Press End -> jump to last tab
      fireEvent.keyDown(tablist, { key: "End" });
      expect(tabs[2].getAttribute("aria-selected")).toBe("true");
      expect(screen.getByRole("tabpanel").textContent).toContain("Pricing Content");

      // Press Home -> jump back to first tab
      fireEvent.keyDown(tablist, { key: "Home" });
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(screen.getByRole("tabpanel").textContent).toContain("Overview Content");
    });
  });

  describe("Disclosure Component (W3C Disclosure Pattern)", () => {
    it("renders with aria-expanded and toggles panel on click", () => {
      render(
        <Disclosure title="FAQ Question" defaultOpen={false}>
          FAQ Answer Body
        </Disclosure>
      );

      const button = screen.getByRole("button", { name: /FAQ Question/i });
      expect(button.getAttribute("aria-expanded")).toBe("false");

      // Click button to expand
      fireEvent.click(button);
      expect(button.getAttribute("aria-expanded")).toBe("true");
      expect(screen.getByRole("region")).not.toBeNull();
      expect(screen.getByText("FAQ Answer Body")).not.toBeNull();

      // Click button again to collapse
      fireEvent.click(button);
      expect(button.getAttribute("aria-expanded")).toBe("false");
    });
  });
});
