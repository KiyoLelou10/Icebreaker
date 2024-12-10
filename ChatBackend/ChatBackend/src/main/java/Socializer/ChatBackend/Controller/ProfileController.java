package Socializer.ChatBackend.Controller;


import Socializer.ChatBackend.DTOS.AvailableUserDTO;
import Socializer.ChatBackend.DTOS.PublicUserProfileDTO;
import Socializer.ChatBackend.Services.PublicUserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private PublicUserProfileService publicUserProfileService;

    @GetMapping("/fetchMyDetails")
    public ResponseEntity<PublicUserProfileDTO> getUserDetails(JwtAuthenticationToken token) {
        System.out.println("Request is made for profile details");

        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String keycloakUserId = token.getToken().getSubject();


        PublicUserProfileDTO profile = publicUserProfileService.getUserDetailsById(keycloakUserId);
        return ResponseEntity.ok(profile);
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

}
