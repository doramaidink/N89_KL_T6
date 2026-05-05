import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";


const WEBHOOK_URL = "https://duckien123.app.n8n.cloud/webhook-test/chat";


const ChatbotN8n = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Xin chào!\nTôi có thể giúp được gì cho bạn?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async (customText) => {
        const text = (customText || input).trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("https://duckien123.app.n8n.cloud/webhook-test/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatInput: text,
                    message: text,
                }),
            });

            const data = await res.json();

            const botReply =
                data.reply ||
                data.message ||
                data.text ||
                data.output ||
                "Bot đã nhận tin nhắn nhưng chưa có phản hồi.";

            setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Không kết nối được chatbot n8n." },
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
                            <img src="/img/chatbot.png" alt="" />
                        </div>

                        <div>
                            <h3>BackingVietNam AI</h3>
                            <p>Trợ Lý Ảo</p>
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
                                        <img src="/img/chatbot.png" alt="" />
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
                                    <img src="/img/chatbot.png" alt="" />
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
                            placeholder="Nhập tin nhắn..."
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />

                        <button className="buttongui-chatbot" type="button" onClick={() => sendMessage()}>
                            <Send className="fly-chatbot" size={20} />
                        </button>
                    </div>
                </div>
            )}

            <button className="bizchat-toggle" type="button" onClick={() => setOpen(!open)}>
                <MessageCircle size={28} />
            </button>
        </div>
    );
};

export default ChatbotN8n;