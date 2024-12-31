package Socializer.ChatBackend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymmetricDTO {
    String chatId;
    String userId;
    String symmetricKey;
}
