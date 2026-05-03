import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  args: Record<string, string>,
  state: "call" | "result" = "result"
): ToolInvocation {
  if (state === "result") {
    return { toolCallId: "test", toolName, args, state, result: "ok" };
  }
  return { toolCallId: "test", toolName, args, state };
}

// --- label derivation ---

test("getToolCallLabel: str_replace_editor create", () => {
  expect(
    getToolCallLabel(makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }))
  ).toBe("Creating /App.jsx");
});

test("getToolCallLabel: str_replace_editor str_replace", () => {
  expect(
    getToolCallLabel(makeInvocation("str_replace_editor", { command: "str_replace", path: "/Card.jsx" }))
  ).toBe("Editing /Card.jsx");
});

test("getToolCallLabel: str_replace_editor insert", () => {
  expect(
    getToolCallLabel(makeInvocation("str_replace_editor", { command: "insert", path: "/utils.js" }))
  ).toBe("Editing /utils.js");
});

test("getToolCallLabel: str_replace_editor view", () => {
  expect(
    getToolCallLabel(makeInvocation("str_replace_editor", { command: "view", path: "/App.jsx" }))
  ).toBe("Reading /App.jsx");
});

test("getToolCallLabel: str_replace_editor undo_edit", () => {
  expect(
    getToolCallLabel(makeInvocation("str_replace_editor", { command: "undo_edit", path: "/App.jsx" }))
  ).toBe("Undoing edit in /App.jsx");
});

test("getToolCallLabel: file_manager rename", () => {
  expect(
    getToolCallLabel(makeInvocation("file_manager", { command: "rename", path: "/old.jsx" }))
  ).toBe("Renaming /old.jsx");
});

test("getToolCallLabel: file_manager delete", () => {
  expect(
    getToolCallLabel(makeInvocation("file_manager", { command: "delete", path: "/App.jsx" }))
  ).toBe("Deleting /App.jsx");
});

test("getToolCallLabel: unknown tool falls back to tool name", () => {
  expect(
    getToolCallLabel(makeInvocation("some_other_tool", {}))
  ).toBe("some_other_tool");
});

test("getToolCallLabel: str_replace_editor with no path falls back to tool name", () => {
  expect(
    getToolCallLabel(makeInvocation("str_replace_editor", { command: "create" }))
  ).toBe("str_replace_editor");
});

// --- rendering: state indicators ---

test("ToolCallBadge shows green dot when state is result", () => {
  const { container } = render(
    <ToolCallBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "result")} />
  );
  const dot = container.querySelector(".bg-emerald-500");
  expect(dot).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolCallBadge shows spinner when state is not result", () => {
  const { container } = render(
    <ToolCallBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "call")} />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge renders friendly label text", () => {
  render(
    <ToolCallBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" })} />
  );
  expect(screen.getByText("Creating /App.jsx")).toBeDefined();
});
