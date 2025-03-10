package Socializer.ChatBackend.Controller;

import Socializer.ChatBackend.DTOS.LocationDTO;
import Socializer.ChatBackend.Services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping
    public void saveOrUpdateLocation(JwtAuthenticationToken token, @RequestBody LocationDTO locationDTO) {
        if (token == null || token.getToken() == null) {
            System.out.println("Token is null");
            return;
        }
        String keycloakUserId = token.getToken().getSubject();
        locationService.saveLocation(locationDTO, keycloakUserId);
    }
}
