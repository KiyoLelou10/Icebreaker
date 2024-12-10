package Socializer.ChatBackend.DTOS;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserProfileDTO {

        private Optional<UUID> id = Optional.empty();
        private Optional<String> userName = Optional.empty();
        private String bio;
        private Integer age;
        private String gender;
        private Optional<String> profilePhoto = Optional.empty();

}
