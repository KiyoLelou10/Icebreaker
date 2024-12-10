package Socializer.ChatBackend.Controller;

import Socializer.ChatBackend.Entities.Message;
import Socializer.ChatBackend.Repository.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    MessageService messageService;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendMessage")  // This listens to messages with the destination "/app/sendMessage"
    public void sendMessage(Message message) {
        System.out.println("Received message: " + message);
        messageService.save(message);
        messagingTemplate.convertAndSendToUser(message.getReceiver(), "/queue/reply", message);
    }
}




