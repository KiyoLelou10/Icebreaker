package Socializer.ChatBackend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sender;
    private String receiver;
    private String text;
    private long timestamp;

    public Message(String sender, String receiver, String text, Long timestamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.text = text;
        this.timestamp = timestamp;

    }

    public Message() {
    }

    public Long getId() {
        return id;
    }

    public String getSender() {
        return sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getText() {
        return text;
    }

    public long getTimestamp() {
        return timestamp;
    }

}
