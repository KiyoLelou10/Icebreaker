package Socializer.ChatBackend.DTOS.MessagingDTOS;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotificationDTO {

    private String chatId;
    private String senderId;
    private String recipientId;
    private String content;

}
