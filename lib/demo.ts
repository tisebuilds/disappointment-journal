const OFFSET_KEY = "dtc_demo_offset_v1";

export function loadDemoDayOffset(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(OFFSET_KEY);
    if (raw === null) return 0;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export function saveDemoDayOffset(days: number): void {
  if (typeof window === "undefined") return;
  const safe = Math.max(0, Math.floor(days));
  localStorage.setItem(OFFSET_KEY, String(safe));
}

export function demoNow(): Date {
  return new Date(Date.now() + loadDemoDayOffset() * 86_400_000);
}

export function daysBetween(iso: string, now: Date = demoNow()): number {
  return Math.floor(
    (now.getTime() - new Date(iso).getTime()) / 86_400_000,
  );
}

/** Offset needed so `createdAt` reads as `targetDays` old. */
export function offsetForTargetAge(
  createdAt: string,
  targetDays: number,
): number {
  const current = daysBetween(createdAt, new Date());
  return Math.max(0, targetDays - current);
}

export function formatDemoDate(now: Date = demoNow()): string {
  return now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
