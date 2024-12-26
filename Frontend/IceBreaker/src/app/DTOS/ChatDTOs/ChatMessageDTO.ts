export interface ChatMessageDTO {
  senderId: string|undefined;
  recipientId: string|undefined;
  content: string;
  timestamp: Date;
}
