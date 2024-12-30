package Socializer.ChatBackend.Repository.PublicProfiles;

import Socializer.ChatBackend.DTOS.EncryptionDTO;
import Socializer.ChatBackend.Entities.EncryptionEntity;
import org.apache.tomcat.util.net.openssl.ciphers.Encryption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface EncryptionRepository extends JpaRepository<EncryptionEntity, UUID> {

    @Query("SELECT u.privateKey FROM EncryptionEntity u WHERE u.keycloakUserId = :keycloakUserId")
    String findPrivateKeyByKeycloakUserId(@Param("keycloakUserId") String keycloakUserId);
}
