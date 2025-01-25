package Socializer.ChatBackend.Repository.PublicProfiles;

import Socializer.ChatBackend.Entities.PublicUserProfileEntity;
import Socializer.ChatBackend.Enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PublicUserProfileRepository extends JpaRepository<PublicUserProfileEntity, UUID> {
    Optional<PublicUserProfileEntity> findByKeycloakUserId(String keycloakUserId);

    Optional<PublicUserProfileEntity> findById(UUID id);

    @Query("SELECT p.id FROM PublicUserProfileEntity p WHERE p.keycloakUserId = :keycloakUserId")
    UUID findIdByKeycloakUserId(@Param("keycloakUserId") String keycloakUserId);

    @Query("SELECT u FROM PublicUserProfileEntity u WHERE u.username LIKE %:username% AND u.keycloakUserId <> :currentUserId")
    List<PublicUserProfileEntity> findByUsername(@Param("username") String username, @Param("currentUserId") String currentUserId);

    List<PublicUserProfileEntity> findAllByKeycloakUserIdNot(String id);

    List<PublicUserProfileEntity> findAllByStatusAndKeycloakUserIdNot(Status status, String keycloakUserId);
}
