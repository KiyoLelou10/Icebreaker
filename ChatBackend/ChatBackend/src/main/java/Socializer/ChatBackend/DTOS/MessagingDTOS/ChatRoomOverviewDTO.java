package Socializer.ChatBackend.DTOS.MessagingDTOS;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatRoomOverviewDTO {
    private String chatId;
    private String recipientId;
    private String recipientName;
    private String recipientProfilePicture;
    private String lastMessageContent;
    private Date lastMessageTimestamp;
}
