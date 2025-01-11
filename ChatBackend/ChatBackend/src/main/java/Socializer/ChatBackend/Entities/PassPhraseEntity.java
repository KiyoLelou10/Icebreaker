package Socializer.ChatBackend.Entities;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PassPhraseEntity {
    @Id
    private String userId; //saved the keycloak user id for simpler implementation
    private String passphrase;
    private Integer magicNumber;
}
