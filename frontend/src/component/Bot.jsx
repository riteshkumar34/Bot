import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export default function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4002/api/v1/chat/message", {
        text: input,
      });

      if (res.status === 200) {
        setMessages((prev) => [
          ...prev,
          { text: res.data.userMessage, sender: "user" },
          { text: res.data.botMessage, sender: "bot" },
        ]);
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }

    setInput("");
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // DELETE HISTORY
  const deleteHistoryItem = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* ================= Sidebar ================ */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden sm:flex flex-col p-4 space-y-4">
        <h2 className="text-lg font-semibold">History</h2>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {messages.filter((m) => m.sender === "user").length} chats
          </span>
          <button
            onClick={clearHistory}
            className="text-xs text-red-400 hover:text-red-500 px-2 py-1 rounded-md"
          >
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.filter((m) => m.sender === "user").length === 0 ? (
            <p className="text-gray-500 text-sm">No chats yet</p>
          ) : (
            messages.map(
              (msg, idx) =>
                msg.sender === "user" && (
                  <div
                    key={idx}
                    className="flex items-center justify-between space-x-2"
                  >
                    <div className="flex-1 p-3 bg-gray-800 rounded-lg text-sm truncate">
                      {msg.text.slice(0, 30)}...
                    </div>

                    <button
                      onClick={() => deleteHistoryItem(idx)}
                      className="text-sm text-red-400 hover:text-red-500 px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )
            )
          )}
        </div>
      </aside>

      {/* ================ MAIN CHAT AREA ================ */}
      <div className="flex flex-col min-h-screen flex-1 bg-[#0d0d0d] text-white">

        {/* Header */}
        <header className="fixed top-0 left-64 w-[calc(100%-16rem)] bg-black/50 backdrop-blur-lg border-b border-gray-800 z-10 shadow-lg hidden sm:block">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">
              Ritesh AI
            </h1>
            <FaUserCircle size={34} className="text-gray-300" />
          </div>
        </header>

        {/* Mobile Header */}
        <header className="sm:hidden fixed top-0 left-0 w-full bg-black/60 backdrop-blur-lg border-b border-gray-800 z-10 shadow-lg">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-xl font-bold">Ritesh AI</h1>
            <FaUserCircle size={30} className="text-gray-300" />
          </div>
        </header>

        {/* Chat Body */}
        <main className="flex-1 overflow-y-auto pt-24 pb-28 px-4">
          <div className="max-w-3xl mx-auto space-y-4">

            {messages.length === 0 ? (
              <div className="text-center text-gray-400 text-lg mt-20">
                👋 Hi, I'm <span className="text-green-500">BotSpoof</span>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex w-full ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-md ${
                        msg.sender === "user"
                          ? "bg-green-600 text-white rounded-br-none"
                          : "bg-gray-800 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-300 px-5 py-3 rounded-2xl animate-pulse">
                      Typing...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </main>

        {/* Footer Input */}
        <footer className="fixed bottom-0 left-0 sm:left-64 w-full sm:w-[calc(100%-16rem)] bg-black/50 backdrop-blur-lg border-t border-gray-800 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="w-full flex items-center bg-gray-900/80 rounded-full px-4 py-3 shadow-xl border border-gray-700 space-x-3">

              {/* IMAGE UPLOAD */}
              <label className="cursor-pointer text-gray-300 hover:text-white">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setMessages((prev) => [
                        ...prev,
                        { sender: "user", text: "[Image sent]" },
                      ]);
                    }
                  }}
                />
                📷
              </label>

              {/* Voice Button */}
              <button
                onClick={() => console.log("Start voice recording...")}
                className="text-gray-300 hover:text-white"
              >
                🎤
              </button>

              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                placeholder="Ask BotSpoof..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              <button
                onClick={handleSendMessage}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-full shadow-md"
              >
                Send
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
