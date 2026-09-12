"use client";

import { AlertCircle, X } from "lucide-react";

interface AdminErrorProps {
  message: string | null;
  onDismiss?: () => void;
}

/** Inline error banner. Admin actions used to fail into the console only. */
export function AdminError({ message, onDismiss }: AdminErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="დახურვა"
          className="flex-shrink-0 rounded p-0.5 hover:bg-red-100 dark:hover:bg-red-900/40"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default AdminError;
