package Socializer.ChatBackend.Controller.MessagesController;


import Socializer.ChatBackend.DTOS.MessagingDTOS.ChatNotificationDTO;
import Socializer.ChatBackend.DTOS.MessagingDTOS.ChatMessageDTO;
import Socializer.ChatBackend.DTOS.MessagingDTOS.ChatRoomOverviewDTO;
import Socializer.ChatBackend.Entities.MessagingEntities.ChatMessage;
import Socializer.ChatBackend.Services.ChatMessageService;
import Socializer.ChatBackend.Services.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private ChatRoomService chatRoomService;


    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageDTO chatMessage) {
        System.out.println("Processing message from: " + chatMessage.getSenderId() +
                " to: " + chatMessage.getRecipientId());

        ChatMessage savedMsg = chatMessageService.saveChatMessage(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(),
                "/queue/messages",
                new ChatNotificationDTO(
                        savedMsg.getChatId(),
                        savedMsg.getSenderId().toString(),
                        savedMsg.getRecipientId().toString(),
                        savedMsg.getContent()
                )
        );

        System.out.println("Message sent to recipient queue: " + chatMessage.getRecipientId());
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessageDTO>> findChatMessages(@PathVariable String senderId,
                                                                 @PathVariable String recipientId) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, recipientId));
    }


    @GetMapping("/chat-rooms/{userId}")
    public ResponseEntity<List<ChatRoomOverviewDTO>> getChatRooms(@PathVariable String userId) {
        System.out.println("Getting chat rooms for user: " + userId);
        List<ChatRoomOverviewDTO> chatRooms = chatRoomService.getChatRoomsForUser(userId);
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/messages/{chatId}")
    public ResponseEntity<List<ChatMessageDTO>> getMessagesForChatRoom(@PathVariable String chatId) {
        List<ChatMessageDTO> messages = chatMessageService.getMessagesForChatRoom(chatId);
        return ResponseEntity.ok(messages);
    }


}




