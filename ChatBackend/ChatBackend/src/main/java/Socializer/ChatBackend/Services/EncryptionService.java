package Socializer.ChatBackend.Services;

import Socializer.ChatBackend.DTOS.EncryptionDTO;
import Socializer.ChatBackend.DTOS.SymmetricDTO;
import Socializer.ChatBackend.Entities.EncryptionEntity;
import Socializer.ChatBackend.Entities.SymmetricEncryptionEntity;
import Socializer.ChatBackend.Repository.MessagingRepositories.SymmetricEncryptionRepository;
import Socializer.ChatBackend.Repository.PublicProfiles.EncryptionRepository;
import Socializer.ChatBackend.Repository.PublicProfiles.PublicUserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EncryptionService {

    @Autowired
    private EncryptionRepository encryptionRepository;

    @Autowired
    private SymmetricEncryptionRepository symmetricEncryptionRepository;


    @Autowired
    private PublicUserProfileRepository publicUserProfileRepository;


    public void saveSymmetricEncryption(SymmetricDTO symmetricDTO) {
        SymmetricEncryptionEntity entity = SymmetricEncryptionEntity.builder()
                .senderId(symmetricDTO.getSenderId())
                .recipientId(symmetricDTO.getRecipientId())
                .symmetricKey(symmetricDTO.getSymmetricKey())
                .build();
        symmetricEncryptionRepository.save(entity);
    }

    public String getSymmetricKey(String senderId, String recipientId) {
        return symmetricEncryptionRepository.findSymmetricKeyForChat(senderId, recipientId);
    }


    public String getPrivatKey(String keycloakUserId) {
        return encryptionRepository.findPrivateKeyByKeycloakId(keycloakUserId);
    }


    public void saveEncryptionDTO(EncryptionDTO encryptionDTO, String keycloakId) {
        UUID userID = getUserID(keycloakId);
        EncryptionEntity newEntity = EncryptionEntity.builder()
                .userId(userID)
                .keycloakUserId(keycloakId)
                .publicKey(encryptionDTO.getPublicKey())
                .privateKey(encryptionDTO.getPrivateKey())
                .build();
        encryptionRepository.save(newEntity);
    }

    private UUID getUserID(String keycloakUserId) {
        return publicUserProfileRepository.findIdByKeycloakUserId(keycloakUserId);
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
