package Socializer.ChatBackend.Repository;

import org.springframework.stereotype.Service;

@Service
public class MessageService {

  //  @Autowired
//    private ChatMessageRepository chatMessageRepository;
//
//    public void save(ChatMessage chatMessage) {
//        chatMessageRepository.save(chatMessage);
//    }
//
//    public Set<String> getAllChatPartners(String user) {
//        List<String> senders = chatMessageRepository.findSendersByReceiver(user);
//        List<String> receivers = chatMessageRepository.findReceiversBySender(user);
//
//        Set<String> chatPartners = new HashSet<>();
//        chatPartners.addAll(senders);
//        chatPartners.addAll(receivers);
//
//        return chatPartners;
//    }
//
//    public ChatMessagesWithTimestamp getRecentChatMessages(String Sender, String receiver) {
//        Pageable pageable = PageRequest.of(0, 50, Sort.by(Sort.Order.desc("timestamp")));
//        List<Object[]> sendMessages = chatMessageRepository.findSentMessages(Sender, receiver, pageable);
//        List<Object[]> receivedMessages = chatMessageRepository.findReceivedMessages(Sender, receiver, pageable);
//
//        List<Object[]> allMessages = new ArrayList<>();
//
//        for (Object[] message : sendMessages) {
//            Object[] messageWithFlag = new Object[3];
//            messageWithFlag[0] = message[0];
//            messageWithFlag[1] = message[1];
//            messageWithFlag[2] = "sent";
//            allMessages.add(messageWithFlag);
//        }
//
//        for (Object[] message : receivedMessages) {
//            Object[] messageWithFlag = new Object[3];
//            messageWithFlag[0] = message[0];
//            messageWithFlag[1] = message[1];
//            messageWithFlag[2] = "received";
//            allMessages.add(messageWithFlag);
//        }
//
//        allMessages.sort((msg1, msg2) -> {
//            long timestamp1 = (long) msg1[1];
//            long timestamp2 = (long) msg2[1];
//            return Long.compare(timestamp2, timestamp1);
//        });
//
//        if(allMessages.isEmpty()) {
//            return null;
//        }
//
//        List<Object[]> limitedMessages = allMessages.stream()
//                .limit(50)
//                .collect(Collectors.toList());
//
//        // After limiting, update the timestamp to the oldest message in this batch
//        Long timestamp = (Long) limitedMessages.get(limitedMessages.size() - 1)[1];// Get the timestamp of the oldest message
//
//        ChatMessagesWithTimestamp messagesWithTimestamp = new ChatMessagesWithTimestamp(allMessages, timestamp);
//
//        return messagesWithTimestamp;
//
//    }
//
//    public ChatMessagesWithTimestamp getOlderChatMessages(String sender, String receiver, Long timestamp) {
//        List<Object[]> sendMessages = chatMessageRepository.findSentMessagesOlder(sender, receiver, timestamp);
//        List<Object[]> receivedMessages = chatMessageRepository.findReceivedMessagesOlder(sender, receiver, timestamp);
//
//        // Combine messages and add a flag for sent/received
//        List<Object[]> allMessages = new ArrayList<>();
//
//        sendMessages.forEach(message -> {
//            allMessages.add(new Object[]{message[0], message[1], "sent"});
//        });
//
//        receivedMessages.forEach(message -> {
//            allMessages.add(new Object[]{message[0], message[1], "received"});
//        });
//
//        // Sort messages by timestamp in descending order (newest first)
//        allMessages.sort((msg1, msg2) -> Long.compare((Long) msg2[1], (Long) msg1[1]));
//
//        if(allMessages.isEmpty()) {
//            return null;
//        }
//
//        List<Object[]> limitedMessages = allMessages.stream()
//                .limit(50)
//                .collect(Collectors.toList());
//
//        timestamp = (Long) limitedMessages.get(limitedMessages.size() - 1)[1];
//
//        ChatMessagesWithTimestamp messagesWithTimestamp = new ChatMessagesWithTimestamp(allMessages, timestamp);
//
//        return messagesWithTimestamp;
//    }



}
