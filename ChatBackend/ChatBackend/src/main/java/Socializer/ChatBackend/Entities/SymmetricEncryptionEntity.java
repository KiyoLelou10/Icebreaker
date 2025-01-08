package Socializer.ChatBackend.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "symmetric_encryption_entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SymmetricEncryptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "sender_id", nullable = false)
    private String senderId;

    @Column(name = "recipient_id", nullable = false)
    private String recipientId;

    @Column(name = "symmetric_key",nullable = false, columnDefinition = "TEXT")
    private String symmetricKey;

}
