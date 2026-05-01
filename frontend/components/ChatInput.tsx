"use client";
import { useState, useRef, KeyboardEvent } from "react";

interface Props {
  onSend: (q: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [val, setVal] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    if (!val.trim() || loading) return;
    onSend(val.trim());
    setVal("");
    setTimeout(() => ref.current?.focus(), 50);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  const canSend = val.trim().length > 0 && !loading;

  return (
    <div className="px-6 pb-4 pt-3 border-t border-[#F0F0F8] shrink-0 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-[#F4F6FA] rounded-full px-5 py-3 border border-[#EBEBF5] shadow-sm">
          <textarea
            ref={ref}
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={onKey}
            placeholder="What's in your mind..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[13px] text-[#1a1a2e] placeholder-[#9B9BB4] font-['DM_Sans'] leading-6"
            style={{ maxHeight: "96px" }}
          />
          <button
            onClick={submit}
            disabled={!canSend}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
              canSend
                ? "bg-gradient-to-br from-[#4361EE] to-[#3A86FF] hover:opacity-90 shadow-md"
                : "bg-[#E2E4EE] cursor-not-allowed"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 5.5l5 2 2 5L13 1z" fill="white"/>
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-[#9B9BB4] text-center mt-2">
          NyaySetu provides legal information, not legal advice. Always consult a qualified lawyer.
        </p>
      </div>
    </div>
  );
}