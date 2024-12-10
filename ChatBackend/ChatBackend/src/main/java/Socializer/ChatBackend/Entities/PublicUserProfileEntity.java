package Socializer.ChatBackend.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Entity
@Table(name = "public_user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicUserProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "keycloak_user_id", nullable = false, unique = true)
    private String keycloakUserId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, length = 1024)
    private String bio;

    @Column(nullable = false, length = 1024)
    private String profilePhoto;

    @Column
    private Integer age;

    @Column
    private String gender;

    @Column(name = "is_profile_complete", nullable = false, length = 1024)
    private Boolean isProfileComplete = false;
}
