package Socializer.ChatBackend.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageRepository extends CrudRepository {
    @Query("SELECT m.receiver FROM Message m WHERE m.sender = :user")
    List<String> findReceiversBySender(@Param("user") String user);

    @Query("SELECT m.sender FROM Message m WHERE m.receiver = :user")
    List<String> findSendersByReceiver(@Param("user") String user);

    @Query("SELECT m.text, m.timestamp FROM Message m WHERE m.sender = :sender AND m.receiver = :receiver ORDER BY m.timestamp DESC  LIMIT 50")
    List<Object[]> findSentMessages(@Param("sender") String sender, @Param("receiver") String receiver, Pageable pageable);

    @Query("SELECT m.text, m.timestamp FROM Message m WHERE m.sender = :receiver AND m.receiver = :sender ORDER BY m.timestamp DESC LIMIT 50")
    List<Object[]> findReceivedMessages(@Param("sender") String sender, @Param("receiver") String receiver, Pageable pageable);


    @Query("SELECT m.text, m.timestamp FROM Message m WHERE m.sender = :sender AND m.receiver = :receiver AND m.timestamp < :timestamp ORDER BY m.timestamp DESC  LIMIT 50")
    List<Object[]> findSentMessagesOlder(@Param("sender") String sender, @Param("receiver") String receiver,@Param("timestamp") Long timestamp);

    @Query("SELECT m.text, m.timestamp FROM Message m WHERE m.sender = :receiver AND m.receiver = :sender AND m.timestamp < :timestamp ORDER BY m.timestamp DESC LIMIT 50")
    List<Object[]> findReceivedMessagesOlder(@Param("sender") String sender, @Param("receiver") String receiver,@Param("timestamp") Long timestamp);

}
