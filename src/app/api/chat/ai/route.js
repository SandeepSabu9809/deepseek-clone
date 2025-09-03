export const maxDuration = 60;
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Chat from "../../../../../models/Chat";
import connectDB from "../../../../../config/db";

// Initialize OpenAI client with DeepSeek API KEY and base URL
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    // Extract chatId and prompt from request body
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated", // ✅ fixed typo
      });
    }

    // Find the chat document
    await connectDB();
    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return NextResponse.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Create a user message object
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    chat.messages.push(userPrompt);

    // ✅ Send full conversation (not dummy message)
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: chat.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const message = completion.choices[0].message;
    message.timestamp = Date.now();

    chat.messages.push(message);
    await chat.save();

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
