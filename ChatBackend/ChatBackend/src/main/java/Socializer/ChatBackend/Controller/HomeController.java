package Socializer.ChatBackend.Controller;

import Socializer.ChatBackend.DTOS.ProfileNavbarDTO;
import Socializer.ChatBackend.Services.PublicUserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profileHome")
public class HomeController {

    @Autowired
    private PublicUserProfileService publicUserProfileService;

    @GetMapping("/me")
    public ResponseEntity<ProfileNavbarDTO> getOrCreateUserProfile(JwtAuthenticationToken token) {
        System.out.println("Request is made");

        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String keycloakUserId = token.getToken().getSubject();
        String username = token.getToken().getClaim("preferred_username");

        ProfileNavbarDTO profile = publicUserProfileService.getOrCreateProfileDTO(keycloakUserId, username);

        return ResponseEntity.ok(profile);
    }

}
