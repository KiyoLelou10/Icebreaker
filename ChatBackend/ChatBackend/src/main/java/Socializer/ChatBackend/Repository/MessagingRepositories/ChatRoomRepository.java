package Socializer.ChatBackend.Repository.MessagingRepositories;

import Socializer.ChatBackend.Entities.MessagingEntities.ChatRoom;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends CrudRepository<ChatRoom, UUID> {

    Optional<ChatRoom> findBySenderIdAndRecipientId(UUID senderId, UUID recipientId);
}
