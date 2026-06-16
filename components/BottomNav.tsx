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
      className="flex shrink-0 items-center justify-around border-t border-mail-border bg-mail-surface/80 px-4 pt-2 backdrop-blur-md"
      style={{
        paddingBottom: `calc(12px + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <button
        type="button"
        onClick={() => onTab("entries")}
        className="relative flex min-h-[48px] min-w-[72px] flex-1 flex-col items-center justify-center gap-1 border-0 bg-transparent text-[11px] font-medium"
        style={{ color: active === "entries" ? "#111111" : "#8a8a86" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
        </svg>
        Inbox
      </button>

      <button
        type="button"
        onClick={onAdd}
        className="mx-2 flex size-14 shrink-0 items-center justify-center rounded-full border-0 bg-mail-header text-2xl font-light text-white shadow-md"
        aria-label="Compose new message"
      >
        +
      </button>

      <button
        type="button"
        onClick={() => onTab("settings")}
        className="relative flex min-h-[48px] min-w-[72px] flex-1 flex-col items-center justify-center gap-1 border-0 bg-transparent text-[11px] font-medium"
        style={{ color: active === "settings" ? "#111111" : "#8a8a86" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Settings
      </button>
    </nav>
  );
}
