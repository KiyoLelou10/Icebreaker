package Socializer.ChatBackend.Services;

import Socializer.ChatBackend.DTOS.LocationDTO;
import Socializer.ChatBackend.Entities.LocationEntity;
import Socializer.ChatBackend.Repository.LocationRepository;
import Socializer.ChatBackend.Repository.PublicProfiles.PublicUserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PublicUserProfileRepository publicUserProfileRepository;


    public void saveLocation(LocationDTO location, String keycloakUserId) {
        UUID userId = publicUserProfileRepository.findIdByKeycloakUserId(keycloakUserId);
        LocationEntity locationEntity = LocationEntity.builder()
                .userId(userId)
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .build();
        locationRepository.save(locationEntity);
    }


}
