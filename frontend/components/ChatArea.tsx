"use client";
import { RefObject } from "react";
import { Conversation, Message, Citation } from "@/lib/types";

const SUGGESTED = [
  { icon: "📋", text: "How do I file an RTI application?" },
  { icon: "⏱", text: "What is the time limit for RTI response?" },
  { icon: "🔒", text: "What information is exempt from RTI?" },
  { icon: "💼", text: "Rights if employer doesn't pay salary?" },
];

interface Props {
  conversation: Conversation | null;
  loading: boolean;
  bottomRef: RefObject<HTMLDivElement>;
  onSuggest: (q: string) => void;
}

function CitationCard({ c, i }: { c: Citation; i: number }) {
  return (
    <div className="bg-white border border-[#EBEBF5] border-l-[3px] border-l-[#4361EE] rounded-r-xl rounded-bl-xl p-3">
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="bg-[#EEF2FF] text-[#4361EE] text-[10px] font-bold px-2 py-0.5 rounded-full">
          [{i + 1}]
        </span>
        <span className="text-[12px] font-semibold text-[#2D2D4E]">{c.act}</span>
        <span className="text-[11px] bg-[#F0F4FF] text-[#4361EE] px-2 py-0.5 rounded-md">
          {c.section}
        </span>
      </div>
      <p className="text-[12px] text-[#9B9BB4] leading-5">{c.relevance}</p>
      {c.source_url && c.source_url !== "N/A" && (
        <a
          href={c.source_url}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-[#4361EE] mt-1 inline-block hover:underline"
        >
          View source →
        </a>
      )}
    </div>
  );
}

function UserBubble({ msg }: { msg: Message }) {
  return (
    <div className="flex justify-end items-start gap-3">
      <div className="flex flex-col items-end gap-1 max-w-[70%]">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] text-[#9B9BB4]">You</span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4361EE] to-[#3A86FF] flex items-center justify-center text-white text-[10px] font-bold">
            U
          </div>
        </div>
        <div className="bg-[#F4F6FA] text-[#1a1a2e] text-[13px] leading-relaxed rounded-2xl rounded-tr-sm px-4 py-3 border border-[#EBEBF5]">
          {msg.content}
        </div>
      </div>
    </div>
  );
}

function AiBubble({ msg }: { msg: Message }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4361EE] to-[#3A86FF] flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5">
        NS
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[11px] font-semibold text-[#4361EE] tracking-wide uppercase">
            NyaySetu
          </span>
          <span className="text-[10px] text-[#9B9BB4]">·</span>
          <span className="text-[10px] text-[#9B9BB4]">AI Legal Assistant</span>
        </div>

        {/* Answer */}
        <div className="text-[13px] leading-[1.7] text-[#2D2D4E] mb-3">
          {msg.content}
        </div>

        {/* Confidence bar */}
        {msg.confidence !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-1 bg-[#EBEBF5] rounded-full">
              <div
                className="h-1 rounded-full transition-all"
                style={{
                  width: `${Math.round((msg.confidence || 0) * 100)}%`,
                  background: msg.confidence > 0.5 ? "#22c55e" : msg.confidence > 0.2 ? "#f59e0b" : "#4361EE",
                }}
              />
            </div>
            <span className="text-[11px] text-[#9B9BB4] whitespace-nowrap">
              {Math.round((msg.confidence || 0) * 100)}% confidence · {msg.sources_used} sources
            </span>
          </div>
        )}

        {/* Citations */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-[#9B9BB4] uppercase tracking-wider mb-1.5">
              Legal References
            </p>
            <div className="flex flex-col gap-2">
              {msg.citations.map((c, i) => <CitationCard key={i} c={c} i={i} />)}
            </div>
          </div>
        )}

        {/* Next steps */}
        {msg.next_steps && msg.next_steps.length > 0 && (
          <div className="bg-[#F7F7FC] border border-[#EBEBF5] rounded-2xl p-3 mb-3">
            <p className="text-[10px] font-semibold text-[#3A3A5C] uppercase tracking-wider mb-2">
              Recommended Steps
            </p>
            <div className="flex flex-col gap-2">
              {msg.next_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#4361EE] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-[12px] text-[#5A5A7A] leading-5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {msg.disclaimer && (
          <p className="text-[11px] text-[#9B9BB4] italic leading-5">
            ⚠ {msg.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#4361EE] to-[#3A86FF] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
        NS
      </div>
      <div className="bg-[#F4F6FA] border border-[#EBEBF5] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-[#4361EE] dot-1 inline-block" />
          <span className="w-2 h-2 rounded-full bg-[#4361EE] dot-2 inline-block" />
          <span className="w-2 h-2 rounded-full bg-[#4361EE] dot-3 inline-block" />
        </div>
        <span className="text-[12px] text-[#9B9BB4]">Searching Indian legal database...</span>
      </div>
    </div>
  );
}

export default function ChatArea({ conversation, loading, bottomRef, onSuggest }: Props) {
  const hasMessages = conversation && conversation.messages.length > 0;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {!hasMessages ? (
        /* Welcome screen */
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4361EE] to-[#3A86FF] flex items-center justify-center text-3xl mx-auto mb-4">
              ⚖
            </div>
            <h2 className="text-[22px] font-semibold text-[#1a1a2e] mb-2">
              How can I help you today?
            </h2>
            <p className="text-[13px] text-[#9B9BB4] max-w-sm leading-6">
              Ask any question about Indian law and get cited answers from real statutes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
            {SUGGESTED.map((s, i) => (
              <button
                key={i}
                onClick={() => onSuggest(s.text)}
                className="flex items-start gap-3 p-4 rounded-2xl border border-[#EBEBF5] bg-[#FAFAFD] hover:border-[#4361EE] hover:bg-[#EEF2FF] text-left transition-all group"
              >
                <span className="text-lg shrink-0">{s.icon}</span>
                <span className="text-[13px] text-[#3A3A5C] leading-5 font-normal group-hover:text-[#4361EE]">
                  {s.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Messages */
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {conversation.messages.map(msg =>
            msg.role === "user"
              ? <UserBubble key={msg.id} msg={msg} />
              : <AiBubble key={msg.id} msg={msg} />
          )}
          {loading && <LoadingBubble />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}