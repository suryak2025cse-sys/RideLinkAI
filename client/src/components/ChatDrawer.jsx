import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Send, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { toggleChatDrawer, addMessage } from '../redux/chatSlice';

export default function ChatDrawer() {
  const dispatch = useDispatch();
  const { isChatDrawerOpen, messages, activeRecipient } = useSelector((state) => state.chat);
  const [text, setText] = useState('');

  if (!isChatDrawerOpen) return null;

  const recipientName = activeRecipient?.name || 'Surya K (Driver)';
  const recipientPhone = activeRecipient?.phone || '+91 9025953166';

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch(addMessage({
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setText('');

    // Simulated driver response
    setTimeout(() => {
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        sender: 'driver',
        text: 'Got your message! See you at the pickup location.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }, 1200);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{recipientName}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>{recipientPhone}</span>
              <span className="text-emerald-600 font-bold ml-1 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => dispatch(toggleChatDrawer(false))}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-semibold">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${recipientName}...`}
          className="form-input text-sm py-2.5 flex-1"
        />
        <button type="submit" className="btn-primary p-3 text-sm">
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
