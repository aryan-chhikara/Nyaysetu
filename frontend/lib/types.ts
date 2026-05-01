export interface Citation {
  act: string;
  section: string;
  relevance: string;
  source_url: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  next_steps?: string[];
  confidence?: number;
  disclaimer?: string;
  sources_used?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}