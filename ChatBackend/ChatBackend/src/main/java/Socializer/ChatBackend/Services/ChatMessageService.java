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

        // Always get or create a consistent chatId
        Optional<String> chatIdOptional = chatRoomService.getChatRoomId(
                chatMessageDTO.getSenderId(),
                chatMessageDTO.getRecipientId()
        );

        // If chatId is not present, throw an exception
        String chatId = chatIdOptional.orElseThrow(() ->
                new IllegalStateException("Chat room ID could not be created or found"));

        // Create and save the chat message
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
        UUID senderUUID = UUID.fromString(senderId);
        UUID recipientUUID = UUID.fromString(recipientId);

        String chatId = chatRoomService.getChatRoomId(senderId, recipientId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room could not be created or found"));


        return chatMessageRepository.findByChatId(chatId)
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



    public List<ChatMessageDTO> getMessagesForChatRoom(String chatId) {
        return chatMessageRepository.findByChatId(chatId).stream()
                .map(this::convertToDTO)
                .toList();
    }






}
