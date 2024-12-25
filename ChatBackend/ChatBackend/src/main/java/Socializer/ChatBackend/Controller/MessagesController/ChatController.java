package Socializer.ChatBackend.Controller.MessagesController;


import Socializer.ChatBackend.DTOS.MessagingDTOS.ChatNotificationDTO;
import Socializer.ChatBackend.DTOS.MessagingDTOS.ChatMessageDTO;
import Socializer.ChatBackend.Entities.MessagingEntities.ChatMessage;
import Socializer.ChatBackend.Services.ChatMessageService;
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


    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageDTO chatMessage) {
        ChatMessage savedMsg = chatMessageService.saveChatMessage(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                new ChatNotificationDTO(
                        savedMsg.getChatId(),
                        savedMsg.getSenderId().toString(),
                        savedMsg.getRecipientId().toString(),
                        savedMsg.getContent()
                )
        );
    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessageDTO>> findChatMessages(@PathVariable String senderId,
                                                                 @PathVariable String recipientId) {
        return ResponseEntity
                .ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

}




