from telethon import TelegramClient
import pandas as pd

# Replace these with your own credentials
api_id = 'YOUR_API_ID'
api_hash = 'YOUR_API_HASH'
phone_number = 'YOUR_PHONE_NUMBER'  # e.g., '+1234567890'

# Initialize the Telegram client
client = TelegramClient('session_name', api_id, api_hash)

async def main():
    # Connect to Telegram
    await client.start(phone=phone_number)
    print("Client connected!")

    # Specify the bot's username or chat ID
    bot_username = 'YOUR_BOT_USERNAME'  # e.g., 'MyBot'

    # Get the chat entity (bot)
    bot_entity = await client.get_entity(bot_username)

    # Fetch messages from the chat
    messages = await client.get_messages(bot_entity, limit=1000)  # Adjust limit as needed

    # Extract message data
    data = []
    for message in messages:
        data.append({
            'Date': message.date,
            'Sender': message.sender_id,
            'Message': message.text,
            'Message ID': message.id,
            'Reply To': message.reply_to_msg_id if message.is_reply else None
        })

    # Create a DataFrame and export to Excel
    df = pd.DataFrame(data)
    df.to_excel('telegram_chat.xlsx', index=False)
    print("Chat exported to 'telegram_chat.xlsx'")

# Run the script
with client:
    client.loop.run_until_complete(main())