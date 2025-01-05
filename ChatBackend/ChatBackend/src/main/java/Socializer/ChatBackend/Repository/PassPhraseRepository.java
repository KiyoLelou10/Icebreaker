package Socializer.ChatBackend.Repository;

import Socializer.ChatBackend.Entities.PassPhraseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PassPhraseRepository extends JpaRepository<PassPhraseEntity, String> {
}
