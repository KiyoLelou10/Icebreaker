package Socializer.ChatBackend.Repository.MessagingRepositories;

import Socializer.ChatBackend.Entities.MessagingEntities.ChatRoom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends CrudRepository<ChatRoom, UUID> {

    Optional<ChatRoom> findByChatId(String chatId);

    List<ChatRoom> findBySenderIdOrRecipientId(UUID senderId, UUID recipientId);

    @Query("SELECT c.chatId FROM ChatRoom c WHERE c.senderId = :senderId AND c.recipientId = :recipientId")
    String findChatIdBySenderAndRecipient(@Param("senderId") UUID senderId, @Param("recipientId") UUID recipientId);

    List<ChatRoom> findAllBySenderIdOrRecipientId(UUID senderId, UUID recipientId);
}
