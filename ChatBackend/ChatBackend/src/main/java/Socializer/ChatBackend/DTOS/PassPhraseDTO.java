package Socializer.ChatBackend.DTOS;


import lombok.Data;

@Data
public class PassPhraseDTO {
    private String passphrase;
    private Integer magicNumber;
}
