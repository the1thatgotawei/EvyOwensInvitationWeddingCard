import { useEffect } from "react";

// Event details — 15:00 SAST = 13:00 UTC
const TITLE = "Evy & Owen's Wedding";
const LOCATION = "The Stay by Inimitable, 198 Driefontein Rd, Muldersdrift, Gauteng, 1747";
const START_UTC = "20270327T130000Z";
const END_UTC = "20270327T210000Z"; // 23:00 SAST — minimum sensible end time
const START_ISO = "2027-03-27T13:00:00Z";
const END_ISO = "2027-03-27T21:00:00Z";

function downloadIcs() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Evy & Owen Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${START_UTC}`,
    `DTEND:${END_UTC}`,
    `SUMMARY:${TITLE}`,
    `LOCATION:${LOCATION.replace(/,/g, "\\,")}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "evy-owen-wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openGoogle() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${START_UTC}/${END_UTC}`,
    location: LOCATION,
  });
  window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
}

function openOutlook() {
  const params = new URLSearchParams({
    subject: TITLE,
    startdt: START_ISO,
    enddt: END_ISO,
    location: LOCATION,
  });
  window.open(
    `https://outlook.live.com/calendar/0/action/compose?${params}`,
    "_blank"
  );
}

interface Props {
  onClose: () => void;
}

export default function CalendarModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const options: { label: string; action: () => void }[] = [
    { label: "Apple Calendar", action: downloadIcs },
    { label: "Google Calendar", action: openGoogle },
    { label: "Outlook", action: openOutlook },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "rgba(45, 28, 8, 0.50)" }}
      onClick={onClose}
    >
      <div
        className="relative mx-6 w-full max-w-[300px] flex flex-col items-center"
        style={{
          background: "#f7f3eb",
          border: "1px solid rgba(184, 150, 62, 0.40)",
          boxShadow: "0 12px 48px rgba(50, 30, 5, 0.28)",
          padding: "1.75rem 1.5rem 1.5rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#b8963e",
            fontSize: "0.85rem",
            lineHeight: 1,
            padding: "4px",
          }}
        >
          ✕
        </button>

        {/* Heading */}
        <p
          style={{ fontFamily: "'Raleway', sans-serif" }}
          className="text-[0.42rem] tracking-[0.28em] uppercase text-[#8a6a30] mb-1"
        >
          Save the Date
        </p>
        <h2
          style={{ fontFamily: "'Great Vibes', cursive" }}
          className="text-[1.9rem] text-[#b8963e] leading-none mb-1"
        >
          Add to Calendar
        </h2>

        {/* Divider */}
        <div className="flex items-center gap-2 w-full my-4">
          <div className="flex-1 h-px bg-[#c8a45a]/35" />
          <span className="text-[#b8963e] text-[0.55rem]">✕</span>
          <div className="flex-1 h-px bg-[#c8a45a]/35" />
        </div>

        {/* Calendar options */}
        <div className="w-full flex flex-col gap-2.5">
          {options.map(({ label, action }) => (
            <button
              key={label}
              onClick={() => {
                action();
                onClose();
              }}
              style={{ fontFamily: "'Raleway', sans-serif" }}
              className="w-full py-3 text-[0.5rem] tracking-[0.2em] uppercase border border-[#c8a45a]/55 text-[#7a5c1e] bg-transparent hover:bg-[#b8963e]/10 active:bg-[#b8963e]/20 transition-colors cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Event summary */}
        <div className="mt-5 w-full">
          <div className="flex items-center gap-2 w-full mb-3">
            <div className="flex-1 h-px bg-[#c8a45a]/35" />
            <span className="text-[#b8963e] text-[0.55rem]">✕</span>
            <div className="flex-1 h-px bg-[#c8a45a]/35" />
          </div>
          <p
            style={{ fontFamily: "'Lora', serif" }}
            className="text-[0.58rem] text-[#5a4020] text-center leading-relaxed italic"
          >
            Saturday, 27 March 2027
          </p>
          <p
            style={{ fontFamily: "'Raleway', sans-serif" }}
            className="text-[0.44rem] tracking-wide text-[#8a7050] text-center mt-1"
          >
            3:00 PM · The Stay by Inimitable
          </p>
          <p
            style={{ fontFamily: "'Raleway', sans-serif" }}
            className="text-[0.4rem] tracking-wide text-[#a08060] text-center mt-0.5"
          >
            Muldersdrift, Gauteng
          </p>
        </div>
      </div>
    </div>
  );
}
