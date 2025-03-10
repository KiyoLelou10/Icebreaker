package Socializer.ChatBackend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private double latitude;
    private double longitude;
}
