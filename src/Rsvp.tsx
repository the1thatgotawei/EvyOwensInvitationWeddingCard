import { useState } from "react"
import bgImg from "@/imports/Typeflow_Background.png"

const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyV7DWoLiGNsQZpMQ4n8mfUrNFi9d7zoCN2D4GRme-RtTxgHLQA0bpNnyODPEmoBZM/exec"

type SubmitState = "idle" | "submitting" | "success" | "error"

const isFromAcc =
  new URLSearchParams(window.location.search).get("from") === "acc"

export default function Rsvp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dietary, setDietary] = useState("")
  const [fridayDinner, setFridayDinner] = useState<"yes" | "no" | "">("")
  const [wedding, setWedding] = useState<"yes" | "no" | "">("")
  const [sundayBreakfast, setSundayBreakfast] = useState<"yes" | "no" | "">("")
  const [stayingAtAcc, setStayingAtAcc] = useState<"yes" | "no" | "">("")
  const [submitState, setSubmitState] = useState<SubmitState>("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitState("submitting")
    try {
      const response = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          dietary,
          fridayDinner,
          wedding,
          sundayBreakfast,
          ...(isFromAcc && { stayingAtAccommodation: stayingAtAcc }),
        }),
      })
      setSubmitState("success")
    } catch {
      setSubmitState("error")
    }
  }

  const canSubmit =
    submitState !== "submitting" &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    fridayDinner !== "" &&
    wedding !== "" &&
    sundayBreakfast !== "" &&
    (!isFromAcc || stayingAtAcc !== "")

  return (
    <div className="min-h-screen flex justify-center bg-[#f0ece3]">
      <div
        className="w-full max-w-[530px] relative"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#f0ece3",
          minHeight: "100dvh",
        }}
      >
        {/* Form content — centred in the open ivory area below the monogram */}
        <div className="flex flex-col items-center px-10 pt-[45%] pb-20">
          {/* Section heading */}
          <p
            style={{ fontFamily: "'Raleway', sans-serif" }}
            className="text-[0.48rem] tracking-[0.28em] uppercase text-[#8a6a30] mb-1"
          >
            Kindly
          </p>
          <h1
            style={{ fontFamily: "'Great Vibes', cursive" }}
            className="text-[3.2rem] text-[#b8963e] leading-none mb-4"
          >
            Respond
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-2 w-full mb-8">
            <div className="flex-1 h-px bg-[#c8a45a]/40" />
            <span className="text-[#b8963e] text-[0.6rem]">✕</span>
            <div className="flex-1 h-px bg-[#c8a45a]/40" />
          </div>

          {submitState === "success" ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-3 py-4">
              <span className="text-[#b8963e] text-2xl">✦</span>
              <p
                style={{ fontFamily: "'Great Vibes', cursive" }}
                className="text-[#b8963e] text-[2rem] leading-none"
              >
                {"We'll see you there!"}
              </p>
              <p
                style={{ fontFamily: "'Lora', serif" }}
                className="text-[#6a5030] text-[0.7rem] italic text-center leading-relaxed mt-1"
              >
                {"Thank you, " +
                  firstName +
                  ". We cannot wait to celebrate with you."}
              </p>
              <div className="flex items-center gap-2 w-full mt-4">
                <div className="flex-1 h-px bg-[#c8a45a]/40" />
                <span className="text-[#b8963e] text-[0.6rem]">✕</span>
                <div className="flex-1 h-px bg-[#c8a45a]/40" />
              </div>
              <p
                style={{ fontFamily: "'Lora', serif" }}
                className="text-[#8a7050] text-[0.6rem] italic text-center"
              >
                {"We can't wait to celebrate with you."}
              </p>
            </div>
          ) : (
            /* ── Form ── */
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-7"
              noValidate
            >
              {/* First Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  className="text-[0.48rem] tracking-[0.22em] uppercase text-[#7a5c1e] text-center"
                >
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  autoComplete="given-name"
                  style={{ fontFamily: "'Lora', serif" }}
                  className="w-full border-b border-[#c8a45a] bg-transparent text-[0.75rem] text-[#4a3510] placeholder:text-[#c8b080] outline-none py-2 text-center"
                />
              </div>

              {/* Surname */}
              <div className="flex flex-col gap-1.5">
                <label
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  className="text-[0.48rem] tracking-[0.22em] uppercase text-[#7a5c1e] text-center"
                >
                  Surname
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Your surname"
                  autoComplete="family-name"
                  style={{ fontFamily: "'Lora', serif" }}
                  className="w-full border-b border-[#c8a45a] bg-transparent text-[0.75rem] text-[#4a3510] placeholder:text-[#c8b080] outline-none py-2 text-center"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  className="text-[0.48rem] tracking-[0.22em] uppercase text-[#7a5c1e] text-center"
                >
                  Please enter any dietary requirements.
                </label>
                <input
                  type="text"
                  required
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="dietary requirements"
                  autoComplete="family-name"
                  style={{ fontFamily: "'Lora', serif" }}
                  className="w-full border-b border-[#c8a45a] bg-transparent text-[0.75rem] text-[#4a3510] placeholder:text-[#c8b080] outline-none py-2 text-center"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  className="text-[0.48rem] tracking-[0.22em] uppercase text-[#7a5c1e] text-center"
                >
                  Will you be attending dinner on Friday Night?
                </label>
                <div className="flex gap-3 justify-center">
                  {(["yes", "no"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFridayDinner(opt)}
                      style={{ fontFamily: "'Raleway', sans-serif" }}
                      className={[
                        "flex-1 py-2.5 text-[0.5rem] tracking-[0.2em] uppercase border transition-colors cursor-pointer",
                        fridayDinner === opt
                          ? "bg-[#b8963e] border-[#b8963e] text-[#f5f0e8]"
                          : "bg-transparent border-[#c8a45a] text-[#7a5c1e] hover:bg-[#b8963e]/10",
                      ].join(" ")}
                    >
                      {opt === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  className="text-[0.48rem] tracking-[0.22em] uppercase text-[#7a5c1e] text-center"
                >
                  Will you be attending the Wedding on Saturday?
                </label>
                <div className="flex gap-3 justify-center">
                  {(["yes", "no"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWedding(opt)}
                      style={{ fontFamily: "'Raleway', sans-serif" }}
                      className={[
                        "flex-1 py-2.5 text-[0.5rem] tracking-[0.2em] uppercase border transition-colors cursor-pointer",
                        wedding === opt
                          ? "bg-[#b8963e] border-[#b8963e] text-[#f5f0e8]"
                          : "bg-transparent border-[#c8a45a] text-[#7a5c1e] hover:bg-[#b8963e]/10",
                      ].join(" ")}
                    >
                      {opt === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <label
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  className="text-[0.48rem] tracking-[0.22em] uppercase text-[#7a5c1e] text-center"
                >
                  Will you be attending Breakfast at Stay on Sunday? (R155 pp)
                </label>
                <div className="flex gap-3 justify-center">
                  {(["yes", "no"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSundayBreakfast(opt)}
                      style={{ fontFamily: "'Raleway', sans-serif" }}
                      className={[
                        "flex-1 py-2.5 text-[0.5rem] tracking-[0.2em] uppercase border transition-colors cursor-pointer",
                        sundayBreakfast === opt
                          ? "bg-[#b8963e] border-[#b8963e] text-[#f5f0e8]"
                          : "bg-transparent border-[#c8a45a] text-[#7a5c1e] hover:bg-[#b8963e]/10",
                      ].join(" ")}
                    >
                      {opt === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accommodation question — only for /acc guests */}
              {isFromAcc && (
                <div className="flex flex-col gap-2.5">
                  <label
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                    className="text-[0.48rem] tracking-[0.22em] uppercase text-[#7a5c1e] text-center"
                  >
                    Will you be staying at the accommodation at Stay?
                  </label>
                  <div className="flex gap-3 justify-center">
                    {(["yes", "no"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setStayingAtAcc(opt)}
                        style={{ fontFamily: "'Raleway', sans-serif" }}
                        className={[
                          "flex-1 py-2.5 text-[0.5rem] tracking-[0.2em] uppercase border transition-colors cursor-pointer",
                          stayingAtAcc === opt
                            ? "bg-[#b8963e] border-[#b8963e] text-[#f5f0e8]"
                            : "bg-transparent border-[#c8a45a] text-[#7a5c1e] hover:bg-[#b8963e]/10",
                        ].join(" ")}
                      >
                        {opt === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {submitState === "error" && (
                <p
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                  className="text-[0.48rem] tracking-wide text-[#a05040] text-center -mt-2"
                >
                  Something went wrong. Please try again.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                style={{ fontFamily: "'Raleway', sans-serif" }}
                className="mt-1 w-full py-3 bg-[#b8963e] text-[#f5f0e8] text-[0.52rem] tracking-[0.22em] uppercase disabled:opacity-40 hover:bg-[#a0803a] active:bg-[#906e2e] transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {submitState === "submitting" ? "Sending…" : "Send Response"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
