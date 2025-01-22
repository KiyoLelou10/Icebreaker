package Socializer.ChatBackend.Controller;


import Socializer.ChatBackend.DTOS.AvailableUserDTO;
import Socializer.ChatBackend.DTOS.EncryptionDTO;
import Socializer.ChatBackend.DTOS.ProfileWithStatusDTO;
import Socializer.ChatBackend.DTOS.PublicUserProfileDTO;
import Socializer.ChatBackend.Enums.Status;
import Socializer.ChatBackend.Services.EncryptionService;
import Socializer.ChatBackend.Services.PublicUserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private PublicUserProfileService publicUserProfileService;

    @Autowired
    private EncryptionService encryptionService;

    @GetMapping("/fetchMyDetails")
    public ResponseEntity<PublicUserProfileDTO> getUserDetails(JwtAuthenticationToken token) {
        System.out.println("Request is made for profile details");

        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String keycloakUserId = token.getToken().getSubject();



        PublicUserProfileDTO profile = publicUserProfileService.getUserDetailsByKeycloakId(keycloakUserId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/fetchMyPrivKey")
    public ResponseEntity<String> getPrivateKey(JwtAuthenticationToken token) {
        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        String keycloakUserId = token.getToken().getSubject();
        String privateKey = encryptionService.getPrivatKey(keycloakUserId);

        return ResponseEntity.ok(privateKey);
    }

    @PostMapping("/uploadKeyPair")
    public ResponseEntity<Object> uploadKeyPair(JwtAuthenticationToken token, @RequestBody EncryptionDTO keyPairDTO) {

        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        String keycloakUserId = token.getToken().getSubject();
        encryptionService.saveEncryptionDTO(keyPairDTO, keycloakUserId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/publicKey/{recipientId}")
    public ResponseEntity<String> findUserPublicKey(@PathVariable String recipientId) {
        String publicKey = encryptionService.getPublicKeyByUserId(recipientId);
        if (publicKey == null) {
            System.out.println("Public key not found");
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(publicKey);
    }


    @PutMapping("/updateDetails")
    public ResponseEntity<PublicUserProfileDTO> updateProfileDetails(
            JwtAuthenticationToken token,
            @RequestBody PublicUserProfileDTO updatedProfile) {

        System.out.println("Request is made to update profile details");

        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String keycloakUserId = token.getToken().getSubject();

        // Update the profile
        PublicUserProfileDTO profile = publicUserProfileService.updateProfile(keycloakUserId, updatedProfile);

        return ResponseEntity.ok(profile);
    }



    @GetMapping("/getAllExceptMe")
    public ResponseEntity<List<AvailableUserDTO>> getUsersExceptMe(JwtAuthenticationToken token) {
        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        String currentUserId = token.getToken().getSubject();
        List<AvailableUserDTO> users = publicUserProfileService.getUsersExcept(currentUserId);
        return ResponseEntity.ok(users);
    }


    @GetMapping("/getMyStatusInformation")
    public ResponseEntity<ProfileWithStatusDTO> getMyStatus(JwtAuthenticationToken token){
        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String currentUserId = token.getToken().getSubject();
        ProfileWithStatusDTO information= publicUserProfileService.getMyStatusInformation(currentUserId);
        return ResponseEntity.ok(information);
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, String>> updateUserStatus(
            @PathVariable("id") String userId,
            @RequestBody Map<String, String> requestBody) {

        String statusString = requestBody.get("status");

        try {
            // Validate the status string
            Status status = Status.valueOf(statusString.toUpperCase());

            boolean updated = publicUserProfileService.updateUserStatus(UUID.fromString(userId), status);

            if (updated) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Status updated successfully");
                return ResponseEntity.ok(response); // Return JSON response
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<PublicUserProfileDTO> getProfile(@PathVariable String id) {
        UUID newId = UUID.fromString(id);
        PublicUserProfileDTO profile = publicUserProfileService.getUserDetailsById(newId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/search/{username}")
    public ResponseEntity<List<AvailableUserDTO>> searchUsers(@PathVariable String username, JwtAuthenticationToken token) {
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        // Get the current user's Id
        String currentUserId = token.getToken().getSubject();

        List<AvailableUserDTO> users = publicUserProfileService.searchUsersByUsername(username, currentUserId);
        System.out.println("Search query: " + username);
        System.out.println("Results: " + users);
        return ResponseEntity.ok(users);
    }

}
