'use client';
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import Image from 'next/image';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  // Don't render if no chat is selected
  //if (!selectedChat) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to send message');
    if (isLoading) return toast.error('Wait for the previous prompt response');

    const promptCopy = prompt;
    if (!promptCopy.trim()) return;

    setIsLoading(true);
    setPrompt('');

    // 1️⃣ Create user message
    const userMessage = {
      role: 'user',
      content: promptCopy,
      timestamp: Date.now(),
    };

    // 2️⃣ Update context immediately
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === selectedChat._id
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    try {
      // 3️⃣ Send prompt to AI backend
      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (!data.success) {
        toast.error(data.message || 'AI failed to respond');
        return;
      }

      // 4️⃣ Add empty assistant message first
      setSelectedChat((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: '', timestamp: Date.now() },
        ],
      }));

      // 5️⃣ Animate assistant typing
      const messageTokens = data.data.content.split('');
      messageTokens.forEach((_, i) => {
        setTimeout(() => {
          setSelectedChat((prev) => {
            const updatedMessages = prev.messages.map((msg, idx) =>
              idx === prev.messages.length - 1
                ? { ...msg, content: messageTokens.slice(0, i + 1).join('') }
                : msg
            );
            return { ...prev, messages: updatedMessages };
          });
        }, i * 10); // typing speed (adjust as needed)
      });

      // 6️⃣ Update chats array as well
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, data.data] }
            : chat
        )
      );
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${selectedChat?.messages.length > 0 ?"max-w-3xl":"max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white"
        rows={2}
        placeholder="Message DeepSeek"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between text-sm mt-2">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            type="submit"
            className={`${prompt ? 'bg-primary' : 'bg-[#71717a]'} rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
