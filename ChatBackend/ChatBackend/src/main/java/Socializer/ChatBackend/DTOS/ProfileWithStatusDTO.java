package Socializer.ChatBackend.DTOS;


import Socializer.ChatBackend.Enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileWithStatusDTO {
    private UUID id ;
    private Optional<String> profilePhoto = Optional.empty();
    private Status status;
}
