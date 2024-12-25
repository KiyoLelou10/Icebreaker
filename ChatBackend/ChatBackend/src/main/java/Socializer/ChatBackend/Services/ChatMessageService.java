package Socializer.ChatBackend.Services;


import Socializer.ChatBackend.DTOS.MessagingDTOS.ChatMessageDTO;
import Socializer.ChatBackend.Entities.MessagingEntities.ChatMessage;
import Socializer.ChatBackend.Repository.MessagingRepositories.ChatMessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatMessageService {

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Transactional
    public ChatMessage saveChatMessage(ChatMessageDTO chatMessageDTO) {
        UUID senderId = UUID.fromString(chatMessageDTO.getSenderId());
        UUID recipientId = UUID.fromString(chatMessageDTO.getRecipientId());

        String chatId = chatRoomService
                .getChatRoomId(chatMessageDTO.getSenderId(), chatMessageDTO.getRecipientId(), true)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));



        ChatMessage chatMessage = ChatMessage.builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .content(chatMessageDTO.getContent())
                .timestamp(chatMessageDTO.getTimestamp() != null ? chatMessageDTO.getTimestamp() : new Date())
                .build();

        return chatMessageRepository.save(chatMessage);
    }


    public List<ChatMessageDTO> findChatMessages(String senderId, String recipientId) {
        // Convert senderId and recipientId from String to UUID
        UUID senderUUID = UUID.fromString(senderId);
        UUID recipientUUID = UUID.fromString(recipientId);

        // Find chat room ID
        Optional<String> chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);

        // Fetch messages and convert to DTOs
        return chatId.map(chatMessageRepository::findByChatId)
                .orElse(new ArrayList<>())
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    private ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
        return ChatMessageDTO.builder()
                .senderId(chatMessage.getSenderId().toString())
                .recipientId(chatMessage.getRecipientId().toString())
                .content(chatMessage.getContent())
                .timestamp(chatMessage.getTimestamp())
                .build();
    }


}
