package Socializer.ChatBackend.Controller.Cryptography;


import Socializer.ChatBackend.DTOS.PassPhraseDTO;
import Socializer.ChatBackend.Services.passphraseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cryptography/passphrase")
public class PassPhraseController {

    @Autowired
    private passphraseService cryptographyService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> checkPassphraseStatus(JwtAuthenticationToken token) {

        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String keycloakUserId = token.getToken().getSubject();
        boolean hasPassphrase = cryptographyService.hasPassphrase(keycloakUserId);
        return ResponseEntity.ok(Map.of("hasPassphrase", hasPassphrase));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updatePassphrase(JwtAuthenticationToken  token,
                                              @RequestBody PassPhraseDTO passphraseDto) {
        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String keycloakUserId = token.getToken().getSubject();
        cryptographyService.updatePassphrase(keycloakUserId, passphraseDto.getPassphrase(), passphraseDto.getMagicNumber());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPassphrase(JwtAuthenticationToken token,
                                              @RequestBody Map<String, String> request) {

        if (token == null || token.getToken() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        String keycloakUserId = token.getToken().getSubject();
        String passphrase = request.get("passphrase");
        boolean isValid = cryptographyService.verifyPassphrase(keycloakUserId, passphrase);
        return isValid ? ResponseEntity.ok().build() : ResponseEntity.status(401).build();
    }


}
