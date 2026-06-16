"use client";

export type NavTab = "entries" | "settings";

export function BottomNav({
  active,
  onTab,
  onAdd,
}: {
  active: NavTab;
  onTab: (t: NavTab) => void;
  onAdd: () => void;
}) {
  return (
    <nav
      className="flex shrink-0 items-end justify-around border-t border-ticket-border bg-ticket-paper px-2 pt-2"
      style={{
        paddingBottom: `calc(12px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <button
        type="button"
        onClick={() => onTab("entries")}
        className="relative flex min-h-[48px] min-w-[72px] flex-1 flex-col items-center justify-end gap-1 border-0 bg-transparent pb-1 font-mono text-[10px] font-bold tracking-[0.2em] text-ticket-t3"
        style={{ color: active === "entries" ? "#16100a" : "#7a6248" }}
      >
        {active === "entries" ? (
          <span
            className="absolute top-1 block h-[3px] w-[3px] rounded-full bg-ticket-t1"
            aria-hidden
          />
        ) : null}
        ENTRIES
      </button>
      <button
        type="button"
        onClick={onAdd}
        className="mb-1 flex size-14 shrink-0 items-center justify-center border-0 bg-ticket-paper font-mono text-[22px] font-bold leading-none text-ticket-t1 outline outline-1 outline-ticket-border"
        aria-label="New entry"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => onTab("settings")}
        className="relative flex min-h-[48px] min-w-[72px] flex-1 flex-col items-center justify-end gap-1 border-0 bg-transparent pb-1 font-mono text-[10px] font-bold tracking-[0.2em]"
        style={{ color: active === "settings" ? "#16100a" : "#7a6248" }}
      >
        {active === "settings" ? (
          <span
            className="absolute top-1 block h-[3px] w-[3px] rounded-full bg-ticket-t1"
            aria-hidden
          />
        ) : null}
        SETTINGS
      </button>
    </nav>
  );
}
