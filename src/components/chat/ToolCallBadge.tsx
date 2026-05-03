"use client";

import type { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

export function getToolCallLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const a = args as Record<string, string> | undefined;
  const path = a?.path;

  if (toolName === "str_replace_editor" && path) {
    switch (a?.command) {
      case "create":    return `Creating ${path}`;
      case "str_replace":
      case "insert":    return `Editing ${path}`;
      case "view":      return `Reading ${path}`;
      case "undo_edit": return `Undoing edit in ${path}`;
    }
  }

  if (toolName === "file_manager" && path) {
    switch (a?.command) {
      case "rename": return `Renaming ${path}`;
      case "delete": return `Deleting ${path}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const label = getToolCallLabel(toolInvocation);
  const isDone = toolInvocation.state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
