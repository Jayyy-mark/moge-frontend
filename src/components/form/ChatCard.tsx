'use client';

import { Bot, LucideSend, Paperclip, SkipForward, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { chatApi } from "../../api/chatApi";

type Message = {
  id: number;
  sender: "user" | "admin";
  text?: string;
  file?: File;
  fileUrl?: string;
  fileName?: string;
  time?: string;
};

interface ChatCardProps {
  title?: string;
  messages?: Message[];
}

export default function ChatCard({
  title = "MOGE Bot",
  messages = [],
}: ChatCardProps) {
  const [chat, setChat] = useState(messages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const skipRef = useRef(false);
  const [isTextTyping, setIsTextTyping] = useState(false);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: input,
      file: file || undefined,
      fileUrl: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name,
      time: new Date().toLocaleTimeString(),
    };

    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setFile(null);

    setIsTyping(true);

    try {
      const ai_message = await chatApi.send(userMsg);

      const botId = Date.now() + 1;

      // ✅ Create EMPTY bot message first
      setChat((prev) => [
        ...prev,
        {
          id: botId,
          sender: "admin",
          text: "",
          time: new Date().toLocaleTimeString(),
        },
      ]);

      const fullText = ai_message.response || "No response";
      if (fullText) {
        setIsTyping(false);
      }
      setIsTextTyping(true);
      // ✅ Typing animation
      typeText(fullText, (typedText, isDone) => {
        setChat((prev) =>
          prev.map((msg) =>
            msg.id === botId ? { ...msg, text: typedText } : msg
          )
        );
        if (isDone) {
          setIsTyping(false); // ✅ stop typing ONLY when finished
        }
      });

    } catch (error) {
      setIsTyping(false);

      setChat((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "admin",
          text: "Error: Unable to connect to AI server.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const typeText = (fullText: string, callback: (text: string, done?: boolean) => void) => {
    let index = 0;

    const interval = setInterval(() => {
      callback(fullText.slice(0, index + 1));

      index++;

      // ✅ SKIP CHECK (now works)
      if (skipRef.current) {
        clearInterval(interval);
        skipRef.current = false;

        // instantly finish message
        callback(fullText, true);
        setIsTextTyping(false);
        setIsTyping(false);
        return;
      }

      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTextTyping(false);
      }
    }, 20);
  };



  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 shadow-sm flex flex-col h-[600px]">

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] flex items-center gap-3">

        {/* Circle Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/[0.05] flex items-center justify-center overflow-hidden">

          {/* Option 1: Image */}
          <Bot size={18} className="text-gray-600 dark:text-white/80" />

          {/* Option 2 (fallback icon if no image)
      <User size={18} className="text-gray-600 dark:text-white/80" />
      */}
        </div>

        {/* Title + Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h3>

          {/* <p className="text-xs text-gray-500 dark:text-gray-400">
            Online
          </p> */}
        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
        {chat.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"
                }`}
            >
              {/* ADMIN AVATAR (LEFT SIDE ONLY) */}
              {!isUser && (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/[0.05] flex items-center justify-center overflow-hidden">

                  {/* Option 1: Image */}
                  <Bot size={18} className="text-gray-600 dark:text-white/80" />

                  {/* Option 2 (fallback icon if no image)
              <User size={18} className="text-gray-600 dark:text-white/80" />
              */}
                </div>
              )}

              {/* MESSAGE BUBBLE */}
              <div
                className={`
          max-w-[75%] px-4 py-2 rounded-2xl text-sm
          ${isUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-white/[0.05] text-gray-800 dark:text-white/90 rounded-bl-none"}
        `}
              >
                {/* Text */}
                {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}

                {/* File */}
                {msg.fileUrl && (
                  <div className="mt-2">
                    {msg.file?.type.startsWith("image/") ? (
                      <img
                        src={msg.fileUrl}
                        className="rounded-lg max-w-full max-h-40"
                      />
                    ) : (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        className="underline text-xs"
                      >
                        📄 {msg.fileName}
                      </a>
                    )}
                  </div>
                )}

                {/* Time */}
                {msg.time && (
                  <div className="text-[10px] mt-1 opacity-70">
                    {msg.time}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {isTyping && (
          <div className="flex items-end gap-3 justify-start">

            {/* Bot avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/[0.05] flex items-center justify-center overflow-hidden">

              {/* Option 1: Image */}
              <Bot size={18} className="text-gray-600 dark:text-white/80" />

              {/* Option 2 (fallback icon if no image)
      <User size={18} className="text-gray-600 dark:text-white/80" />
      */}
            </div>

            {/* Typing bubble */}
            <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-white/[0.05]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-white/[0.05] flex flex-col gap-2">

        {/* File preview */}
        {file && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/[0.05] text-sm">
            <span className="flex items-center gap-1 text-gray-700 dark:text-white/80 truncate">
              <Paperclip size={12} />
              {file.name}
            </span>

            <button
              onClick={() => setFile(null)}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Input row */}
        <div className="flex gap-2 items-center">

          {/* File button */}
          <label className="cursor-pointer px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/[0.05] flex items-center justify-center">

            <Paperclip size={18} className="text-gray-600 dark:text-white/80" />

            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Text input */}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="
        flex-1 rounded-lg border px-3 py-2 text-sm
        bg-transparent text-gray-800 dark:text-white/90
        border-gray-300 dark:border-gray-700
        focus:outline-none focus:ring-1 focus:ring-blue-500/30
      "
          />
          <div className="flex gap-2">

            {/* Skip */}
            {isTextTyping && (<button
              onClick={() => {
                skipRef.current = true;
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200"
            >
              <SkipForward size={18} />
            </button>)}

            {/* Send */}
            <button
              onClick={sendMessage}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <LucideSend size={18} />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}