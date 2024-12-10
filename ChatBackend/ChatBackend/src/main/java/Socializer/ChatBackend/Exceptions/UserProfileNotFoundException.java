package Socializer.ChatBackend.Exceptions;

public class UserProfileNotFoundException extends RuntimeException{
    public UserProfileNotFoundException(String message) {
        super(message);
    }
}
