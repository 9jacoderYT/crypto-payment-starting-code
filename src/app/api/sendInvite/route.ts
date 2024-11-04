import axios from "axios";
import { NextResponse } from "next/server";
import { Telegraf } from "telegraf";

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

export async function POST(request: Request) {
  const { userId } = await request.json();
  const chatId = -1002316763403; // Your group chat ID

  try {
    // Check if the chat ID is valid by getting the chat information
    const chat = await bot.telegram.getChat(userId);
    if (!chat) {
      throw new Error("Invalid chat ID. Chat not found.");
    }

    // Calculate 1 hour from now in seconds
    const expireDate = Math.floor(Date.now() / 1000) + 1 * 60 * 60;

    // Create invite link for the group
    const inviteLink = await bot.telegram.createChatInviteLink(chatId, {
      member_limit: 1,
      expire_date: expireDate,
      creates_join_request: false,
    });

    // Send the invite link to user's private chat and verify the success of the message
    const message = await bot.telegram.sendMessage(
      userId,
      `Hello! Here's your group invite link: ${inviteLink.invite_link}\n` +
        "Note: This link will expire in 1 hour and can only be used once."
    );

    if (message) {
      return NextResponse.json({
        status: 200,
        errorStatus: false,
        text: inviteLink.invite_link || "",
      });
    } else {
      throw new Error("Failed to send the message to the user.");
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      status: 500,
      errorStatus: true,
      text: error || "Unable to send Invite link.",
    });
  }
}
