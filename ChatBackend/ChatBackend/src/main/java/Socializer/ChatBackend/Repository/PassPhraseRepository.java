package Socializer.ChatBackend.Repository;

import Socializer.ChatBackend.Entities.PassPhraseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PassPhraseRepository extends JpaRepository<PassPhraseEntity, String> {
    @Query("SELECT p.magicNumber FROM PassPhraseEntity p WHERE p.userId = :userId")
    Integer findMagicNumberByUserId(@Param("userId") String userId);
}
