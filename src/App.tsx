import { useState, useEffect, useRef, useCallback } from "react"
import CalendarModal from "@/CalendarModal"
import envelopeImg from "@/imports/Option_3-1.png"
import page2 from "@/imports/Page_2_-_Redeisgned_.png"
import pageSaveDate from "@/imports/Page_4_-_Save_the_Date.png"
import pageDetails1 from "@/imports/Page_5_-_The_Details_-_Part_1.png"
import pageDetails2 from "@/imports/Page_6_-_The_Details_-_Link_1_.png"
import pageDetails2Link from "@/imports/Page_6-The_Details-Link_2.png"
import pageItinerary from "@/imports/Page_6_-_Full_Itinerary.png"
import pageDressCode from "@/imports/Page_8_-_The_Dress_Code.png"
import pageOurStory from "@/imports/Page_3_-_Our_Story__Updated_.png"
import page5 from "@/imports/Page_5_-_Redeisgn_.png"
import heroVideo from "@/imports/No_Tear_Animation.mp4"
import audioSrc from "@/imports/AUDIO-2026-09-05-21-03-12.mp3"

const WEDDING_DATE = new Date("2027-03-27T15:00:00")

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function CountdownUnit({
  value,
  label,
  className = "",
}: {
  value: number
  label: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center min-w-[2.2rem] ${className}`}>
      <span
        style={{ fontFamily: "'Lora', serif" }}
        className="text-[1.05rem] font-semibold text-[#b8963e] leading-none tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        style={{ fontFamily: "'Raleway', sans-serif" }}
        className="text-[0.38rem] tracking-[0.2em] uppercase text-[#8a6a2e] mt-[2px] font-medium"
      >
        {label}
      </span>
    </div>
  )
}

type Phase = "envelope" | "opening" | "invitation"

/* Soft fade at image top & bottom — disguises section boundaries */
const MASK_FULL =
  "linear-gradient(to bottom, transparent 0%, black 1.5%, black 98.5%, transparent 100%)"
const MASK_BOTTOM_ONLY =
  "linear-gradient(to bottom, black 0%, black 98.5%, transparent 100%)"

export default function App() {
  const [phase, setPhase] = useState<Phase>("envelope")
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(WEDDING_DATE))
  const [activeSection, setActiveSection] = useState(0)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fromAcc = window.location.pathname.startsWith("/acc")

  /* Create single persistent audio instance — never recreated */
  useEffect(() => {
    const audio = new Audio(audioSrc)
    audio.loop = true
    audio.preload = "auto"
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  /* Countdown */
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(WEDDING_DATE)), 1000)
    return () => clearInterval(t)
  }, [])

  /* Lock body scroll during envelope / opening; unlock and reset on invitation */
  useEffect(() => {
    if (phase !== "invitation") {
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      window.scrollTo(0, 0)
    }
    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [phase])

  /* Active-section tracker for nav dots */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sectionRefs.current.indexOf(e.target as HTMLElement)
            if (idx !== -1) setActiveSection(idx)
          }
        })
      },
      { threshold: 0.4 },
    )
    sectionRefs.current.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = useCallback((idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }, [])

  /* Wax-seal tap → start music + play opening video simultaneously */
  const openEnvelope = useCallback(() => {
    setPhase("opening")
    /* Start music from the beginning on the same user gesture */
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
    const vid = videoRef.current
    if (vid) {
      vid.currentTime = 0
      vid.play().catch(() => setPhase("invitation"))
    } else {
      setPhase("invitation")
    }
  }, [])

  /* Video finished → reveal invitation */
  const onVideoEnded = useCallback(() => {
    setPhase("invitation")
  }, [])

  const inInvitation = phase === "invitation"

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          OPENING OVERLAY — envelope → video → dissolve into invitation
          ══════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 z-50 bg-[#f0ece3] md:bg-[#e0d8cc] flex items-center justify-center overflow-hidden"
        style={{
          opacity: inInvitation ? 0 : 1,
          pointerEvents: inInvitation ? "none" : "auto",
          transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ── Constrained card matches invitation width ── */}
        <div className="relative w-full max-w-[480px] h-screen overflow-hidden md:shadow-[0_0_80px_rgba(60,38,12,0.13)]">
          {/* Closed-envelope image */}
          <div
            className="absolute inset-0"
            style={{
              opacity: phase === "envelope" ? 1 : 0,
              transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <img
              src={envelopeImg}
              alt="A sealed envelope addressed to you"
              className="w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center" }}
              draggable={false}
            />
          </div>

          {/* Opening video — preloaded while envelope shows */}
          <div
            className="absolute inset-0 bg-[#f0ece3] flex items-center justify-center"
            style={{
              opacity: phase === "opening" ? 1 : 0,
              transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <video
              ref={videoRef}
              src={heroVideo}
              playsInline
              muted
              preload="auto"
              onEnded={onVideoEnded}
              className="w-full"
              style={{ display: "block", objectFit: "contain" }}
            />
          </div>

          {/* Invisible wax-seal tap target
              Positioned over the E|O seal: ~50% H, ~54–70% V in the cover image */}
          {phase === "envelope" && (
            <button
              onClick={openEnvelope}
              aria-label="Open your invitation"
              style={{
                position: "absolute",
                left: "36%",
                right: "36%",
                top: "54%",
                height: "16%",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                outline: "none",
                zIndex: 20,
              }}
            />
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          INVITATION SCROLL — one continuous piece of luxury stationery
          ══════════════════════════════════════════════════════════════ */}
      <div
        className="flex justify-center bg-[#f0ece3] md:bg-[#e0d8cc] min-h-screen overflow-x-hidden"
        style={{
          opacity: inInvitation ? 1 : 0,
          transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
        }}
      >
        <div className="relative w-full max-w-[480px] md:shadow-[0_0_80px_rgba(60,38,12,0.13)]">
          {/* ── 0 · Evy & Owen — Main Invitation ── */}
          <section
            ref={(el) => (sectionRefs.current[0] = el)}
            className="relative"
          >
            <img
              src={page2}
              alt="You are invited to the wedding of Evy & Owen, Saturday 27 March 2027"
              className="w-full block"
              style={{
                WebkitMaskImage: MASK_BOTTOM_ONLY,
                maskImage: MASK_BOTTOM_ONLY,
              }}
              draggable={false}
            />
            {/* Live countdown — centred between venue illustration and "counting down to our forever" */}
            <div
              className="absolute left-0 right-0 flex justify-center"
              style={{ top: "77.5%" }}
            >
              <div className="flex items-start gap-5">
                <CountdownUnit value={timeLeft.days} label="Days" />
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <CountdownUnit value={timeLeft.minutes} label="Min" />
                <CountdownUnit value={timeLeft.seconds} label="Sec" />
              </div>
            </div>
          </section>

          {/* ── 1 · Our Story ── */}
          <section
            ref={(el) => (sectionRefs.current[1] = el)}
            className="relative"
            style={{ marginTop: "-1px" }}
          >
            <img
              src={pageOurStory}
              alt="Our story — Evy & Owen"
              className="w-full block"
              style={{ WebkitMaskImage: MASK_FULL, maskImage: MASK_FULL }}
              draggable={false}
            />
          </section>

          {/* ── 2 · Save the Date ── */}
          <section
            ref={(el) => (sectionRefs.current[2] = el)}
            className="relative"
            style={{ marginTop: "-1px" }}
          >
            <img
              src={pageSaveDate}
              alt="Save the Date — Evy & Owen, 27 March 2027"
              className="w-full block"
              style={{ WebkitMaskImage: MASK_FULL, maskImage: MASK_FULL }}
              draggable={false}
            />
            {/* Invisible hit area over the ADD TO CALENDAR button in the artwork.
                Adjust top/height if the button sits higher or lower in the image. */}
            <button
              onClick={() => setCalendarOpen(true)}
              aria-label="Add to calendar"
              style={{
                position: "absolute",
                left: "15%",
                right: "15%",
                top: "81%",
                height: "7%",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                outline: "none",
              }}
            />
          </section>

          {/* ── 3 · The Details — Part 1 ── */}
          <section
            ref={(el) => (sectionRefs.current[3] = el)}
            className="relative"
            style={{ marginTop: "-1px" }}
          >
            <img
              src={pageDetails1}
              alt="Wedding details — Ceremony, Reception, Gifts, Accommodations"
              className="w-full block"
              style={{ WebkitMaskImage: MASK_FULL, maskImage: MASK_FULL }}
              draggable={false}
            />
          </section>

          {/* ── 4 · The Details — Part 2 ── */}
          <section
            ref={(el) => (sectionRefs.current[4] = el)}
            className="relative"
            style={{ marginTop: "-1px" }}
          >
            <img
              src={fromAcc ? pageDetails2Link : pageDetails2}
              alt="Wedding details — Part 2"
              className="w-full block"
              style={{ WebkitMaskImage: MASK_FULL, maskImage: MASK_FULL }}
              draggable={false}
            />
          </section>

          {/* ── 5 · Full Itinerary ── */}
          <section
            ref={(el) => (sectionRefs.current[5] = el)}
            className="relative"
            style={{ marginTop: "-1px" }}
          >
            <img
              src={pageItinerary}
              alt="Full itinerary for the wedding day"
              className="w-full block"
              style={{ WebkitMaskImage: MASK_FULL, maskImage: MASK_FULL }}
              draggable={false}
            />
          </section>

          {/* ── 6 · Dress Code ── */}
          <section
            ref={(el) => (sectionRefs.current[6] = el)}
            className="relative"
            style={{ marginTop: "-1px" }}
          >
            <img
              src={pageDressCode}
              alt="Dress code — Ladies: Cocktail, Gentlemen: Formal Suit"
              className="w-full block"
              style={{ WebkitMaskImage: MASK_FULL, maskImage: MASK_FULL }}
              draggable={false}
            />
          </section>

          {/* ── 7 · Respond / RSVP — tap image to reach form ── */}
          <section
            ref={(el) => (sectionRefs.current[7] = el)}
            className="relative"
            style={{ marginTop: "-1px" }}
          >
            <img
              src={page5}
              alt="Kindly Respond — tap to open the RSVP form"
              className="w-full block"
              style={{
                WebkitMaskImage: MASK_FULL,
                maskImage: MASK_FULL,
                boxShadow: "rgba(0,0,0,0.25) 0px 4px 4px 0px inset",
              }}
              draggable={false}
            />
            {/* Invisible full-image click target — stops music, opens Typeform */}
            <button
              onClick={() => {
                audioRef.current?.pause()
                window.location.href = fromAcc ? "/rsvp?from=acc" : "/rsvp"
              }}
              aria-label="Open RSVP form"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                paddingTop: "0px",
                paddingBottom: "41px",
                cursor: "pointer",
                borderColor: "rgba(0,0,0,0)",
                boxShadow: "rgba(0,0,0,0.25) 0px 4px 4px 0px inset",
                WebkitTapHighlightColor: "transparent",
                outline: "none",
              }}
            />
          </section>

          {/* Mute / unmute — fixed bottom-left, ivory + gold, appears with invitation */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute music" : "Mute music"}
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 40,
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              border: "1px solid rgba(200, 164, 90, 0.55)",
              background: "rgba(240, 236, 227, 0.88)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              WebkitTapHighlightColor: "transparent",
              outline: "none",
              opacity: inInvitation ? 1 : 0,
              pointerEvents: inInvitation ? "auto" : "none",
              transition: "opacity 0.6s ease 1.5s",
            }}
          >
            {isMuted ? (
              /* Muted — speaker with X */
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#b8963e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2z" />
                <line x1="10.5" y1="5.5" x2="13.5" y2="10.5" />
                <line x1="13.5" y1="5.5" x2="10.5" y2="10.5" />
              </svg>
            ) : (
              /* Unmuted — speaker with waves */
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#b8963e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2z" />
                <path d="M10 5.5c1 .8 1.5 1.5 1.5 2.5s-.5 1.7-1.5 2.5" />
                <path d="M11.5 3.5c1.7 1.3 2.5 2.8 2.5 4.5s-.8 3.2-2.5 4.5" />
              </svg>
            )}
          </button>

          {/* Navigation dots — appear after invitation is revealed */}
          <div
            className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-[6px]"
            style={{
              opacity: inInvitation ? 1 : 0,
              transition: "opacity 0.6s ease 1.5s",
              pointerEvents: inInvitation ? "auto" : "none",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to section ${i + 1}`}
                style={{ WebkitTapHighlightColor: "transparent" }}
                className={`rounded-full transition-all duration-300 cursor-pointer outline-none ${
                  activeSection === i
                    ? "w-[5px] h-[5px] bg-[#c8a45a]"
                    : "w-[4px] h-[4px] bg-[#c8a45a]/25 hover:bg-[#c8a45a]/55"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {calendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
    </>
  )
}
