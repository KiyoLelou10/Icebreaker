package Socializer.ChatBackend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncryptionDTO {
    private String publicKey;
    private String privateKey;
}
