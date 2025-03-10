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

    @Query(value = """
        SELECT p.*
        FROM public_user_profiles p
        JOIN location_entity l ON p.id = l.user_id
        WHERE p.status = 'ONLINE'
        AND p.id <> :currentUserProfileId  -- Ensures the user itself is not returned
        AND (
            6371 * acos(
                cos(radians(:latitude)) * cos(radians(l.latitude)) *
                cos(radians(l.longitude) - radians(:longitude)) +
                sin(radians(:latitude)) * sin(radians(l.latitude))
            )
        ) <= 3
    """, nativeQuery = true)
    List<PublicUserProfileEntity> findNearbyOnlineUsers(
            @Param("currentUserProfileId") UUID currentUserProfileId,
            @Param("latitude") double latitude,
            @Param("longitude") double longitude
    );
}
