package Socializer.ChatBackend.Repository.MessagingRepositories;

import Socializer.ChatBackend.Entities.SymmetricEncryptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface SymmetricEncryptionRepository extends JpaRepository<SymmetricEncryptionEntity, UUID> {

    @Query("SELECT u.symmetricKey FROM SymmetricEncryptionEntity u WHERE u.chatId = :chatId AND u.userId = :userId")
    String findSymmetricKeyForChat(@Param("chatId") String chatId, @Param("userId") String userId);

}
