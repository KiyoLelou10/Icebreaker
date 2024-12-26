export interface ChatRoomOverviewDTO
{
  chatId: string;
  recipientId: string;
  recipientName: string;
  recipientProfilePicture: string;
  lastMessageContent: string;
  lastMessageTimestamp: Date;
}
