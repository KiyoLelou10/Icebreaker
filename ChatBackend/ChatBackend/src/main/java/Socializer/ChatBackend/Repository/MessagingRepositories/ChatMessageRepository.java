package Socializer.ChatBackend.Repository.MessagingRepositories;

import Socializer.ChatBackend.Entities.MessagingEntities.ChatMessage;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends CrudRepository<ChatMessage, Long>{

    List<ChatMessage> findByChatId(String chatId);

    Optional<ChatMessage> findTopByChatIdOrderByTimestampDesc(String chatId);



//    @Query("SELECT m.receiver FROM ChatMessage m WHERE m.sender = :user")
//    List<String> findReceiversBySender(@Param("user") String user);
//    @Query("SELECT m.sender FROM ChatMessage m WHERE m.receiver = :user")
//    List<String> findSendersByReceiver(@Param("user") String user);
//
//    @Query("SELECT m.text, m.timestamp FROM ChatMessage m WHERE m.sender = :sender AND m.receiver = :receiver ORDER BY m.timestamp DESC  LIMIT 50")
//    List<Object[]> findSentMessages(@Param("sender") String sender, @Param("receiver") String receiver, Pageable pageable);
//
//    @Query("SELECT m.text, m.timestamp FROM ChatMessage m WHERE m.sender = :receiver AND m.receiver = :sender ORDER BY m.timestamp DESC LIMIT 50")
//    List<Object[]> findReceivedMessages(@Param("sender") String sender, @Param("receiver") String receiver, Pageable pageable);
//
//
//    @Query("SELECT m.text, m.timestamp FROM ChatMessage m WHERE m.sender = :sender AND m.receiver = :receiver AND m.timestamp < :timestamp ORDER BY m.timestamp DESC  LIMIT 50")
//    List<Object[]> findSentMessagesOlder(@Param("sender") String sender, @Param("receiver") String receiver,@Param("timestamp") Long timestamp);
//
//    @Query("SELECT m.text, m.timestamp FROM ChatMessage m WHERE m.sender = :receiver AND m.receiver = :sender AND m.timestamp < :timestamp ORDER BY m.timestamp DESC LIMIT 50")
//    List<Object[]> findReceivedMessagesOlder(@Param("sender") String sender, @Param("receiver") String receiver,@Param("timestamp") Long timestamp);

}
