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

    /*
    @Autowired
    private PublicUserProfileRepository publicUserProfileRepository;
    */

    public void saveSymmetricEncryption(SymmetricDTO symmetricDTO) {
        if(symmetricDTO.getChatId() == null)System.out.println("Cannot be Null");
        SymmetricEncryptionEntity entity = SymmetricEncryptionEntity.builder()
                .chatId(symmetricDTO.getChatId())
                .userId(symmetricDTO.getUserId())
                .symmetricKey(symmetricDTO.getSymmetricKey())
                .build();
        symmetricEncryptionRepository.save(entity);
    }

    public String getSymmetricKey(String chatId, String userId) {
        System.out.println("ChatId: " + chatId);
        return symmetricEncryptionRepository.findSymmetricKeyForChat(chatId, userId);
    }


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
