package Socializer.ChatBackend.Repository.PublicProfiles;

import Socializer.ChatBackend.Entities.PublicUserProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PublicUserProfileRepository extends JpaRepository<PublicUserProfileEntity, UUID> {
    Optional<PublicUserProfileEntity> findByKeycloakUserId(String keycloakUserId);

    Optional<PublicUserProfileEntity> findById(UUID id);

    List<PublicUserProfileEntity> findAllByKeycloakUserIdNot(String id);

    Optional<PublicUserProfileEntity> findByUsername(String username);
}
