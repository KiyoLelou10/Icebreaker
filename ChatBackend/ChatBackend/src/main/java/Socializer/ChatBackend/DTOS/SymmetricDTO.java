package Socializer.ChatBackend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymmetricDTO {
    String senderId;
    String recipientId;
    String symmetricKey;
}
