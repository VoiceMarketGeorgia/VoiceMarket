"use client";

import { useSyncExternalStore } from "react";

/**
 * The "shortlist" (კალათა) of voices a visitor has marked.
 *
 * Deliberately auth-free: the picks live in localStorage on the visitor's own
 * device, and a shareable link carries the ids in the query string so a
 * colleague or boss can open the exact same selection without an account.
 */
const STORAGE_KEY = "voicemarket:shortlist";

/** Stable empty reference for the server snapshot (must not change identity). */
const EMPTY: string[] = [];

let snapshot: string[] = EMPTY;
let hydrated = false;
let storageListenerAttached = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed)) return EMPTY;
    const ids = parsed.filter((id): id is string => typeof id === "string");
    return ids.length > 0 ? ids : EMPTY;
  } catch {
    // Private mode, disabled storage, corrupt value - fall back to empty.
    return EMPTY;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage unavailable: the list still works for this visit, it just will
    // not survive a reload. Not worth interrupting the visitor over.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (!storageListenerAttached) {
    storageListenerAttached = true;
    // Keep other tabs of the same site in step.
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      snapshot = readStorage();
      emit();
    });
  }

  // Hydrate after mount rather than during render, so the first client render
  // matches the server output and React does not warn about a mismatch.
  if (!hydrated) {
    hydrated = true;
    const stored = readStorage();
    if (stored !== snapshot) {
      snapshot = stored;
      emit();
    }
  }

  return () => {
    listeners.delete(listener);
  };
}

function commit(next: string[]) {
  snapshot = next.length > 0 ? next : EMPTY;
  persist();
  emit();
}

export function toggleShortlist(id: string) {
  commit(
    snapshot.includes(id)
      ? snapshot.filter((existing) => existing !== id)
      : [...snapshot, id]
  );
}

export function removeFromShortlist(id: string) {
  commit(snapshot.filter((existing) => existing !== id));
}

export function clearShortlist() {
  commit(EMPTY);
}

/** Replace the whole list - used when opening a shared `?ids=` link. */
export function replaceShortlist(ids: string[]) {
  commit(Array.from(new Set(ids)));
}

/** Parse the `ids` query parameter of a shared shortlist link. */
export function parseShortlistParam(value: string | null): string[] {
  if (!value) return EMPTY;
  const ids = value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return ids.length > 0 ? Array.from(new Set(ids)) : EMPTY;
}

export function useShortlist() {
  const ids = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => EMPTY
  );

  return {
    ids,
    count: ids.length,
    has: (id: string) => ids.includes(id),
    toggle: toggleShortlist,
    remove: removeFromShortlist,
    clear: clearShortlist,
    replace: replaceShortlist,
  };
}
