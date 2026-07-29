import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Send, MessageSquare, CheckCheck } from 'lucide-react';
import { toggleChatDrawer, addMessage } from '../redux/chatSlice';
import { socket } from '../services/socket';
import EmptyState from './EmptyState';

export default function ChatDrawer() {
  const { isChatDrawerOpen, messages, isOtherTyping } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_chat_message', (msg) => {
      dispatch(addMessage(msg));
    });
    return () => {
      socket.off('receive_chat_message');
    };
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isChatDrawerOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      _id: `msg_${Date.now()}`,
      rideId: 'ride_active_demo_101',
      senderName: user ? user.name : 'Rider',
      senderRole: user ? user.role : 'Passenger',
      message: inputMsg.trim(),
      createdAt: new Date().toISOString()
    };

    dispatch(addMessage(newMsg));
    socket.emit('send_chat_message', newMsg);
    setInputMsg('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-base text-slate-900">Ride Live Chat</h3>
        </div>
        <button
          onClick={() => dispatch(toggleChatDrawer(false))}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-200/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <EmptyState
            title="No Chat Messages Yet"
            description="Start the conversation with your ride match."
            icon={MessageSquare}
          />
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderName === (user?.name || 'Rider');
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-slate-400 mb-0.5 font-medium">{msg.senderName}</span>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-base font-normal ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className="flex items-center justify-end gap-1 text-[10px] opacity-80 mt-1">
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isOtherTyping && (
          <div className="text-sm text-blue-600 italic font-medium">Driver is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type message to driver..."
          className="form-input text-base py-2.5"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-2xl transition-transform active:scale-95 shadow-sm shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
