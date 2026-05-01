"use client";
import { Conversation } from "@/lib/types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onNew: () => void;
  onSelect: (id: string) => void;
}

export default function Sidebar({ conversations, activeId, onNew, onSelect }: Props) {
  return (
    <aside className="w-[260px] shrink-0 bg-[#F4F6FA] rounded-3xl flex flex-col py-5 px-4 gap-4 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4361EE] to-[#3A86FF] flex items-center justify-center text-white text-sm shrink-0">
          ⚖
        </div>
        <div>
          <p className="text-[14px] font-semibold tracking-wide text-[#1a1a2e]">NyaySetu</p>
          <p className="text-[11px] text-[#9B9BB4]">AI Legal Assistant</p>
        </div>
      </div>

      {/* New Chat */}
      <button
        onClick={onNew}
        className="flex items-center justify-center gap-2 w-full h-10 rounded-full bg-gradient-to-r from-[#4361EE] to-[#3A86FF] text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        New chat
      </button>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 -mx-1 px-1">
        {conversations.length === 0 ? (
          <p className="text-[12px] text-[#9B9BB4] text-center mt-6 px-2 leading-5">
            Your legal queries will appear here
          </p>
        ) : (
          <>
            <p className="text-[11px] text-[#9B9BB4] font-medium px-2 py-1 uppercase tracking-wider">
              Your conversations
            </p>
            {conversations.map(c => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-[12px] transition-all ${
                  activeId === c.id
                    ? "bg-[#E8EEFF] text-[#4361EE] font-medium"
                    : "text-[#5A5A7A] hover:bg-white/70"
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 opacity-60">
                  <path d="M1 1h11v8H7.5L4.5 12V9H1V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-2 border-t border-[#EBEBF5] pt-3">
        {/* Model info */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-white border border-[#EBEBF5]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4361EE] to-[#3A86FF] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            NS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#1a1a2e] truncate">NyaySetu v0.1</p>
            <p className="text-[11px] text-[#9B9BB4]">Groq · RTI Act</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}