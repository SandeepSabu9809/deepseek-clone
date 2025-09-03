// app/api/chat/get/route.js (or pages/api/chat/get.js)
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "../../../../../config/db";
import Chat from "../../../../../models/Chat";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Connect to DB and fetch chats
    await connectDB();
    const chats = await Chat.find({ userId }).lean(); // Use .lean() for performance

    console.log("Fetched chats for user:", userId, chats);

    return NextResponse.json(
      { success: true, data: chats },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}