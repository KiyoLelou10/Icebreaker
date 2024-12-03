package Socializer.ChatBackend.Repository;

import java.util.List;

public class ChatMessagesWithTimestamp {
    private List<Object[]> messages;
    private Long timestamp;

    public ChatMessagesWithTimestamp(List<Object[]> messages, Long timestamp) {
        this.messages = messages;
        this.timestamp = timestamp;
    }

    public List<Object[]> getMessages() {
        return messages;
    }

    public Long getTimestamp() {
        return timestamp;
    }
}
