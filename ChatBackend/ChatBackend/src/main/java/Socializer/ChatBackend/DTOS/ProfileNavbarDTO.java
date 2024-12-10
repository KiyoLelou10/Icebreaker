package Socializer.ChatBackend.DTOS;
import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileNavbarDTO {
        private UUID id;
        private String username;
        private Boolean isProfileComplete;

}
