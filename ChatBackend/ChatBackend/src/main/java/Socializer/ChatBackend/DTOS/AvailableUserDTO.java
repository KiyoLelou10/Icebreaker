package Socializer.ChatBackend.DTOS;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableUserDTO {
    private UUID id;
    private String userName;
    private Optional<String> profilePhoto = Optional.empty();
    private Optional<String> bio = Optional.empty();
}