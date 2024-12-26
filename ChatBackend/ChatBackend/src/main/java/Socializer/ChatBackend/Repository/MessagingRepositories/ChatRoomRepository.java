package Socializer.ChatBackend.Repository.MessagingRepositories;

import Socializer.ChatBackend.Entities.MessagingEntities.ChatRoom;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends CrudRepository<ChatRoom, UUID> {

    Optional<ChatRoom> findByChatId(String chatId);

    List<ChatRoom> findBySenderIdOrRecipientId(UUID senderId, UUID recipientId);
}
