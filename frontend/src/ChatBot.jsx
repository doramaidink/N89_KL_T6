import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const WEBHOOK_URL = "https://tien12233.app.n8n.cloud/webhook/chat";

const ChatbotN8n = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Chào bạn! Tôi là AI của Backing VietNam\nTôi có thể giúp được gì cho bạn?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const getSessionId = () => {
        let sessionId = localStorage.getItem("chat_session_id");

        if (!sessionId) {
            sessionId = "session-" + Date.now();
            localStorage.setItem("chat_session_id", sessionId);
        }

        return sessionId;
    };

    const sendMessage = async (customText) => {
        const text = (customText || input).trim();

        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setLoading(true);

        try {
            const sessionId = getSessionId();

            const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatInput: text,
                    message: text,
                    sessionId,
                }),
            });

            const rawText = await res.text();

            console.log("STATUS N8N:", res.status);
            console.log("RAW N8N:", rawText);

            if (!res.ok) {
                throw new Error("N8N_SERVER_ERROR");
            }

            let data;

            try {
                data = JSON.parse(rawText);
                console.log("DATA:", data);
            } catch {
                data = { reply: rawText };
            }

            const botReply =
                data.reply ||
                data.output ||
                data.text ||
                data.response ||
                data.message ||
                data?.data?.reply ||
                data?.data?.output ||
                data?.[0]?.json?.reply ||
                data?.[0]?.json?.output ||
                "Bot đã nhận tin nhắn nhưng chưa có phản hồi.";

            setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
        } catch (error) {
            console.log("Lỗi gọi chatbot n8n:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: "Chatbot đang lỗi ở n8n hoặc AI đang quá tải. Bạn thử lại sau vài giây nhé.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bizchat-wrapper">
            {open && (
                <div className="bizchat-box">
                    <div className="bizchat-header">
                        <div className="bizchat-logo">
                            <img src="/img/chatbot.png" alt="chatbot" />
                        </div>

                        <div>
                            <h3>BackingVietNam AI</h3>
                            <p>Trợ lý ảo</p>
                        </div>

                        <button type="button" onClick={() => setOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>

                    <div className="bizchat-body">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`bizchat-row ${msg.role === "user" ? "user" : "bot"}`}
                            >
                                {msg.role === "bot" && (
                                    <div className="bizchat-avatar">
                                        <img src="/img/chatbot.png" alt="bot" />
                                    </div>
                                )}

                                <div className={`bizchat-message ${msg.role}`}>
                                    <strong>{msg.role === "bot" ? "BackingVietNam AI" : "Bạn"}</strong>
                                    <span>{msg.text}</span>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="bizchat-row bot">
                                <div className="bizchat-avatar">
                                    <img src="/img/chatbot.png" alt="bot" />
                                </div>

                                <div className="bizchat-message bot">
                                    <strong>BackingVietNam AI</strong>
                                    <span>Đang trả lời...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bizchat-input">
                        <input
                            className="input-chatbot"
                            value={input}
                            disabled={loading}
                            placeholder={loading ? "Đang trả lời..." : "Nhập tin nhắn..."}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !loading) {
                                    sendMessage();
                                }
                            }}
                        />

                        <button
                            className="buttongui-chatbot"
                            type="button"
                            disabled={loading}
                            onClick={() => sendMessage()}
                        >
                            <Send className="fly-chatbot" size={20} />
                        </button>
                    </div>
                </div>
            )}

            <button
                className="bizchat-toggle"
                type="button"
                onClick={() => setOpen(!open)}
            >
                <MessageCircle size={28} />
            </button>
        </div>
    );
};

export default ChatbotN8n;