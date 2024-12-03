package Socializer.ChatBackend.Controller;

import Socializer.ChatBackend.Repository.ChatMessagesWithTimestamp;
import Socializer.ChatBackend.Repository.MessageRepository;
import Socializer.ChatBackend.Repository.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/Icebreaker")
public class GetMessageController {

    @Autowired
    MessageService messageService;

    @GetMapping("ChatOverview/{user}")
    public Set<String> getAllChatPartners(@PathVariable String user) {
        return messageService.getAllChatPartners(user);
    }

    @GetMapping("chat/{sender}/{receiver}")
    public ChatMessagesWithTimestamp getChat(@PathVariable String sender, @PathVariable String receiver) {
        return  messageService.getRecentChatMessages(sender, receiver);
    }

    @GetMapping("older/chats/{sender}/{receiver}/{timestamp}")
    public ChatMessagesWithTimestamp getChat(@PathVariable String sender, @PathVariable String receiver,@PathVariable Long timestamp) {
        return  messageService.getOlderChatMessages(sender, receiver, timestamp);
    }
}
