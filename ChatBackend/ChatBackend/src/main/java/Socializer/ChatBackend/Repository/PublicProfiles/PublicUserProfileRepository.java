package Socializer.ChatBackend.Repository.PublicProfiles;

import Socializer.ChatBackend.Entities.PublicUserProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PublicUserProfileRepository extends JpaRepository<PublicUserProfileEntity, UUID> {
    Optional<PublicUserProfileEntity> findByKeycloakUserId(String keycloakUserId);

    Optional<PublicUserProfileEntity> findById(UUID id);

    List<PublicUserProfileEntity> findAllByKeycloakUserIdNot(String id);

    @Query("SELECT p FROM PublicUserProfileEntity p WHERE p.username LIKE %:username% AND p.keycloakUserId <> :currentUserId")
    List<PublicUserProfileEntity> findByUsername(@Param("username") String username, @Param("currentUserId") String currentUserId);
}
