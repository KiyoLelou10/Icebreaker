package Socializer.ChatBackend.Services;


import Socializer.ChatBackend.DTOS.MessagingDTOS.ChatRoomOverviewDTO;
import Socializer.ChatBackend.DTOS.PublicUserProfileDTO;
import Socializer.ChatBackend.Entities.MessagingEntities.ChatMessage;
import Socializer.ChatBackend.Entities.MessagingEntities.ChatRoom;
import Socializer.ChatBackend.Repository.MessagingRepositories.ChatMessageRepository;
import Socializer.ChatBackend.Repository.MessagingRepositories.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private PublicUserProfileService publicUserProfileService;


    public Optional<String> getChatRoomId(String senderId, String recipientId) {
        String chatId = createChatId(senderId, recipientId);

        Optional<ChatRoom> existingRoom = chatRoomRepository.findByChatId(chatId);
        if (existingRoom.isPresent()) {
            return Optional.of(chatId);
        }

        ChatRoom chatRoom = ChatRoom.builder()
                .chatId(chatId)
                .senderId(UUID.fromString(senderId))
                .recipientId(UUID.fromString(recipientId))
                .build();

        chatRoomRepository.save(chatRoom);
        return Optional.of(chatId);
    }

    private String createChatId(String senderId, String recipientId) {
        return senderId.compareTo(recipientId) < 0
                ? senderId + "_" + recipientId
                : recipientId + "_" + senderId;
    }


    public List<ChatRoomOverviewDTO> getChatRoomsForUser(String userId) {
        System.out.println("Getting chat rooms for user: " + userId);
        UUID userUUID = UUID.fromString(userId);
        List<ChatRoom> chatRooms = chatRoomRepository.findBySenderIdOrRecipientId(userUUID, userUUID);

        return chatRooms.stream()
                .map(room -> {
                    String recipientId = room.getSenderId().toString().equals(userId)
                            ? room.getRecipientId().toString()
                            : room.getSenderId().toString();
                    PublicUserProfileDTO recipientProfile= publicUserProfileService.getUserDetailsById(UUID.fromString(recipientId));
                    String recipientName = recipientProfile.getUserName().orElse("Unknown");
                    String recipientProfilePicture = recipientProfile.getProfilePhoto().orElse("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAyMxpYbLcxvWatBUYSzVuD4obnoOm5y08qZlLwLart-C_6GpANoNrjyyTQ0NpNSK_FOM&usqp=CAU");
                    ChatMessage lastMessage = chatMessageRepository.findTopByChatIdOrderByTimestampDesc(room.getChatId())
                            .orElse(null);

                    return ChatRoomOverviewDTO.builder()
                            .chatId(room.getChatId())
                            .recipientId(recipientId)
                            .recipientName(recipientName)
                            .recipientProfilePicture(recipientProfilePicture)
                            .lastMessageContent(lastMessage != null ? lastMessage.getContent() : "No messages yet")
                            .lastMessageTimestamp(lastMessage != null ? lastMessage.getTimestamp() : null)
                            .build();
                })
                .toList();
    }


}
