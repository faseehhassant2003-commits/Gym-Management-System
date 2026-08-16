import { useEffect,useRef,useState } from "react";
import { sendChatMessage,getChatHistory, clearChatHistory } from "../api/ChatApi";
import "./AIFitnessAssistant.css";
import ReactMarkdown from "react-markdown";
function AIFitnessAssistant() {

    const messagesEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "AI",
            text: "Hi! 👋 I'm your AI Fitness Assistant. Ask me anything about workouts, fitness, or nutrition."
        }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim() || loading) {
            return;
        }

        const userMessage = message.trim();

        // Show user's message immediately
        setMessages((previous) => [
            ...previous,
            {
                sender: "USER",
                text: userMessage,
                 createdAt: new Date().toISOString()
            }
        ]);

        setMessage("");
        setLoading(true);

        try {

            const response = await sendChatMessage(userMessage);

            // Show AI response
            setMessages((previous) => [
                ...previous,
                {
                    sender: "AI",
                    text: response,
                     createdAt: new Date().toISOString()
                }
            ]);

        } catch (error) {

            console.error("Chat error:", error);

            setMessages((previous) => [
                ...previous,
                {
                    sender: "AI",
                    text: "Sorry, I couldn't process your request. Please try again."
                }
            ]);

        } finally {
            setLoading(false);
        }
    };

    const loadChatHistory = async () => {

    try {

        const history = await getChatHistory();

        if (history && history.length > 0) {

            const formattedMessages = history.map((item) => ({
                sender: item.sender,
                text: item.message,
                 createdAt: item.createdAt
            }));

            setMessages(formattedMessages);
        }

    } catch (error) {

        console.error("Failed to load chat history:", error);
    }
};


const handleClearChat = async () => {

    const confirmed = window.confirm(
        "Are you sure you want to clear your chat history?"
    );

    if (!confirmed) {
        return;
    }

    try {

        await clearChatHistory();

        setMessages([
            {
                sender: "AI",
                text: "Hi! 👋 I'm your AI Fitness Assistant. Ask me anything about workouts, fitness, or nutrition."
            }
        ]);

    } catch (error) {

        console.error("Clear chat error:", error);

        alert("Unable to clear chat history. Please try again.");
    }
};


    const handleKeyDown = (event) => {

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };
    useEffect(() => {
    loadChatHistory();
}, []);
useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
    });
}, [messages]);

const formatTime = (date) => {
    if (!date) {
        return "";
    }

    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
};

    return (
        <>
            {/* Floating chatbot button */}
            {!isOpen && (
                <button
                    className="ai-chat-button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open AI Fitness Assistant"
                >
                    🤖
                </button>
            )}

            {/* Chat window */}
            {isOpen && (
                <div className="ai-chat-window">

                    {/* Header */}
                 <div className="ai-chat-header">

    <div>
        <strong>AI Fitness Assistant</strong>
        <span>Online</span>
    </div>

    <div className="ai-chat-header-actions">

        <button
            className="ai-chat-clear"
            onClick={handleClearChat}
            aria-label="Clear chat"
            title="Clear chat"
        >
            🗑️
        </button>

        <button
            className="ai-chat-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chatbot"
        >
            ×
        </button>

    </div>

</div>

                    {/* Messages */}
                    <div className="ai-chat-messages">

                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`ai-message ${
                                    item.sender === "USER"
                                        ? "user"
                                        : "ai"
                                }`}
                            >
                       <ReactMarkdown>
                            {item.text}
                        </ReactMarkdown>

                        {item.createdAt && (
                            <div className="ai-message-time">
                                {formatTime(item.createdAt)}
                            </div>
                        )}
                            </div>
                        ))}

                        {loading && (
                        <div className="ai-message ai typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />

                    </div>

                    {/* Input */}
                    <div className="ai-chat-input">

                        <textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about fitness, workouts or nutrition..."
                            rows="1"
                        />

                        <button
                            onClick={sendMessage}
                            disabled={loading || !message.trim()}
                            aria-label="Send message"
                        >
                            ➤
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}

export default AIFitnessAssistant;