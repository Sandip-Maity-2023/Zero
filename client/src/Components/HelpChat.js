import React, { useState, useRef, useEffect } from 'react';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_CONTEXT = `You are a helpful assistant for ZeroHunger, a food-aid coordination platform that connects food donors, volunteers, and charitable organisations to fight food insecurity, aligned with UN SDG 2 (Zero Hunger).

Key platform roles:
- Donor: Provides food donations and tracks delivery status.
- Volunteer: Accepts and delivers food packages from donors to organisations.
- Organisation: Submits food-aid requests on behalf of communities in need.
- Admin: Reviews and approves platform activity.

Answer questions about how the platform works, how to get started, and any doubts users may have. Be concise, friendly, and encouraging.`;

const HelpChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! 👋 I'm your ZeroHunger assistant. Ask me anything about donating food, volunteering for deliveries, or how the platform works!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to latest message whenever messages change
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    if (!GEMINI_API_KEY) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⚠️ Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY in your .env file.',
        },
      ]);
      setLoading(false);
      return;
    }

    // Build conversation history for multi-turn
    const history = messages
      .filter((m) => m.role !== 'error')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

    // Append current user message
    history.push({ role: 'user', parts: [{ text: trimmed }] });

    try {
      const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
          contents: history,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response. Please try again.";

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Error: ${err.message || 'Something went wrong. Please try again.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`help-fab ${open ? 'help-fab--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open help chat"
        title="Get Help"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="10" r=".5" fill="currentColor" />
            <circle cx="8" cy="10" r=".5" fill="currentColor" />
            <circle cx="16" cy="10" r=".5" fill="currentColor" />
          </svg>
        )}
        {!open && <span className="help-fab-label">Get Help</span>}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="help-panel">
          {/* Header */}
          <div className="help-panel-header">
            <div className="help-panel-header-info">
              <div className="help-panel-avatar">🌱</div>
              <div>
                <div className="help-panel-title">ZeroHunger Assistant</div>
                <div className="help-panel-subtitle">Powered by Gemini AI</div>
              </div>
            </div>
            <button className="help-panel-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="help-panel-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`help-msg help-msg--${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="help-msg-avatar">🌱</div>
                )}
                <div className="help-msg-bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="help-msg help-msg--assistant">
                <div className="help-msg-avatar">🌱</div>
                <div className="help-msg-bubble help-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="help-suggestions">
              {[
                'How do I donate food?',
                'How does volunteer delivery work?',
                'How do I register as an org?',
              ].map((s) => (
                <button key={s} className="help-suggestion-chip" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="help-panel-footer">
            <textarea
              ref={inputRef}
              className="help-input"
              rows={1}
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="help-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpChat;
