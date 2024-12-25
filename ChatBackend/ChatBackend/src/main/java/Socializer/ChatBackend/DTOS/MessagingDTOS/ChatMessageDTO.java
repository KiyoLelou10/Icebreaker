package Socializer.ChatBackend.DTOS.MessagingDTOS;

import lombok.*;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDTO {


    private String senderId;
    private String recipientId;
    private String content;
    private Date timestamp;

}
