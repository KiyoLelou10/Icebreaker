package Socializer.ChatBackend.Services;

import Socializer.ChatBackend.DTOS.EncryptionDTO;
import Socializer.ChatBackend.Entities.EncryptionEntity;
import Socializer.ChatBackend.Repository.PublicProfiles.EncryptionRepository;
import Socializer.ChatBackend.Repository.PublicProfiles.PublicUserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EncryptionService {

    @Autowired
    private EncryptionRepository encryptionRepository;

    /*
    @Autowired
    private PublicUserProfileRepository publicUserProfileRepository;
    */

    public String getPrivatKey(String id) {
        UUID uuid = UUID.fromString(id);
        return encryptionRepository.findPrivateKeyByUserId(uuid);
    }

    public void saveEncryptionDTO(EncryptionDTO encryptionDTO, String id) {
        UUID uuid = UUID.fromString(id);
        EncryptionEntity newEntity = EncryptionEntity.builder()
                .userId(uuid)
                .publicKey(encryptionDTO.getPublicKey())
                .privateKey(encryptionDTO.getPrivateKey())
                .build();
        encryptionRepository.save(newEntity);
    }

    /*public UUID getUserIdByKeycloakId(String id) {
        return publicUserProfileRepository.findIdByKeycloakUserId(id);
    }*/

    public String getPublicKeyByUserId(String id) {
        UUID uuid = UUID.fromString(id);
        String publicKey =  encryptionRepository.findPublicKeyByUserId(uuid);
        System.out.println(publicKey);
        return publicKey;
    }
}
