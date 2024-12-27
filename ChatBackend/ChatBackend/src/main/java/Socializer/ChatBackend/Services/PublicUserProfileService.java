package Socializer.ChatBackend.Services;


import Socializer.ChatBackend.DTOS.AvailableUserDTO;
import Socializer.ChatBackend.DTOS.ProfileNavbarDTO;
import Socializer.ChatBackend.DTOS.ProfileWithStatusDTO;
import Socializer.ChatBackend.DTOS.PublicUserProfileDTO;
import Socializer.ChatBackend.Entities.PublicUserProfileEntity;
import Socializer.ChatBackend.Enums.Status;
import Socializer.ChatBackend.Exceptions.UserProfileNotFoundException;
import Socializer.ChatBackend.Repository.PublicProfiles.PublicUserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PublicUserProfileService {
    @Autowired
    private PublicUserProfileRepository publicUserProfileRepository;


    public boolean isProfileComplete(String keycloakUserId) {
        return publicUserProfileRepository.findByKeycloakUserId(keycloakUserId)
                .map(PublicUserProfileEntity::getIsProfileComplete)
                .orElse(false);
    }

    public ProfileNavbarDTO getOrCreateProfileDTO(String keycloakUserId, String username) {
        PublicUserProfileEntity profile = publicUserProfileRepository.findByKeycloakUserId(keycloakUserId)
                .orElseGet(() -> publicUserProfileRepository.save(
                        PublicUserProfileEntity.builder()
                                .keycloakUserId(keycloakUserId)
                                .username(username)
                                .bio("")
                                .age(0)
                                .gender("")
                                .isProfileComplete(false)
                                .profilePhoto("")
                                .status(Status.ONLINE)
                                .build()
                ));
        return toDTO(profile);
    }


    private ProfileNavbarDTO toDTO(PublicUserProfileEntity profile) {
        return new ProfileNavbarDTO(
                profile.getId(),
                profile.getUsername(),
                profile.getIsProfileComplete()
        );
    }

    public PublicUserProfileDTO getUserDetailsByKeycloakId(String id) {

        PublicUserProfileEntity profileFromDb = publicUserProfileRepository
                .findByKeycloakUserId(id)
                .orElseThrow(() -> new UserProfileNotFoundException("User profile not found for ID: " + id)); // Throw an exception if not found


        return new PublicUserProfileDTO(
                Optional.ofNullable(profileFromDb.getId()), // Handle null safely
                Optional.ofNullable(profileFromDb.getUsername()),
                profileFromDb.getBio(),
                profileFromDb.getAge(),
                profileFromDb.getGender(),
                Optional.ofNullable(profileFromDb.getProfilePhoto()) // Handle null safely
        );
    }

    public PublicUserProfileDTO getUserDetailsById(UUID id) {
        PublicUserProfileEntity profileFromDb = publicUserProfileRepository
                .findById(id)
                .orElseThrow(() -> new UserProfileNotFoundException("User profile not found for ID: " + id));

        return new PublicUserProfileDTO(
                Optional.ofNullable(profileFromDb.getId()),
                Optional.ofNullable(profileFromDb.getUsername()),
                profileFromDb.getBio(),
                profileFromDb.getAge(),
                profileFromDb.getGender(),
                Optional.ofNullable(profileFromDb.getProfilePhoto())
        );
    }


    public PublicUserProfileDTO updateProfile(String keycloakUserId, PublicUserProfileDTO updatedProfile) {
        PublicUserProfileEntity profileEntity = publicUserProfileRepository.findByKeycloakUserId(keycloakUserId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        profileEntity.setUsername(updatedProfile.getUserName().orElse(profileEntity.getUsername()));
        profileEntity.setBio(updatedProfile.getBio());
        profileEntity.setAge(updatedProfile.getAge());
        profileEntity.setGender(updatedProfile.getGender());
        profileEntity.setProfilePhoto(updatedProfile.getProfilePhoto().orElse(null));
        profileEntity.setIsProfileComplete(true);

        PublicUserProfileEntity savedEntity = publicUserProfileRepository.save(profileEntity);

        return new PublicUserProfileDTO(
                Optional.of(savedEntity.getId()),
                Optional.of(savedEntity.getUsername()),
                savedEntity.getBio(),
                savedEntity.getAge(),
                savedEntity.getGender(),
                Optional.ofNullable(savedEntity.getProfilePhoto())
        );
    }



    public List<AvailableUserDTO> getUsersExcept(String currentUserId) {
        List<PublicUserProfileEntity> users = publicUserProfileRepository.findAllByKeycloakUserIdNot(currentUserId);

        return users.stream()
                .map(user -> new AvailableUserDTO(
                        user.getId(),
                        user.getUsername(),
                        Optional.ofNullable(user.getProfilePhoto()),
                        Optional.ofNullable(user.getBio()),
                        user.getStatus()
                ))
                .collect(Collectors.toList());
    }


    public ProfileWithStatusDTO getMyStatusInformation(String currentUserId){
        PublicUserProfileEntity profileEntity = publicUserProfileRepository.findByKeycloakUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        return new ProfileWithStatusDTO(
                profileEntity.getId(),
                profileEntity.getUsername(),
                Optional.of(profileEntity.getProfilePhoto()),
                profileEntity.getStatus()
        );

    }


    public boolean updateUserStatus(UUID userId, Status status) {
        Optional<PublicUserProfileEntity> userOpt = publicUserProfileRepository.findById(userId);

        if (userOpt.isPresent()) {
            PublicUserProfileEntity user = userOpt.get();
            user.setStatus(status);
            publicUserProfileRepository.save(user);
            return true;
        } else {
            return false;
        }
    }
}
