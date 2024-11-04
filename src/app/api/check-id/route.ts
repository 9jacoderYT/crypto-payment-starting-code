import { NextResponse } from "next/server";
import { Telegraf } from "telegraf";

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

export async function POST(request: Request) {
  const { userId } = await request.json();

  console.log(userId);

  try {
    // Check if the chat ID is valid by getting the chat information
    const chat = await bot.telegram.getChat(userId);
    if (!chat) {
      throw new Error("Invalid chat ID. Chat not found.");
    }

    return NextResponse.json({
      status: 500,
      idStatus: false,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      idStatus: true,
    });
  }
}
