package Socializer.ChatBackend.Services;


import Socializer.ChatBackend.Entities.PassPhraseEntity;
import Socializer.ChatBackend.Repository.PassPhraseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class passphraseService {
    @Autowired
    private PassPhraseRepository cryptographyRepository;

    public boolean hasPassphrase(String userId) {
        return cryptographyRepository.findById(userId).isPresent();
    }

    public void updatePassphrase(String userId, String passphrase, Integer magicNumber) {
        PassPhraseEntity entity = cryptographyRepository.findById(userId)
                .orElse(new PassPhraseEntity(userId, passphrase, magicNumber));
        entity.setPassphrase(passphrase);
        entity.setMagicNumber(magicNumber);
        cryptographyRepository.save(entity);
    }

    public boolean verifyPassphrase(String userId, String passphrase) {
        Optional<PassPhraseEntity> optional = cryptographyRepository.findById(userId);
        return optional.map(entity -> entity.getPassphrase().equals(passphrase)).orElse(false);
    }

    public Integer getMagicNumber(String userId) {
        return cryptographyRepository.findMagicNumberByUserId(userId);
    }
}
