package Socializer.ChatBackend.HelperClasses;

import java.util.ArrayList;

public class IcebreakerExtractor {

    public static String trimInputFromOutput(String input, String output) {
        int startIndex = output.indexOf(input);
        if (startIndex == -1) {
            throw new IllegalArgumentException("Input text not found in output.");
        }
        return output.substring(startIndex + input.length()).trim();
    }

    public static ArrayList<String> getIcebreakers(String trimmedInput) {
        ArrayList<String> icebreakers = new ArrayList<>();
        int counterSentence = 0;
        int icebreakerCounter = 0;
        boolean newSentence = false;
        StringBuilder stringBuilder = new StringBuilder();
        for (char c : trimmedInput.toCharArray()) {
            if(!newSentence)stringBuilder.append(c);
            else newSentence = false;
            if(c == '.' || c == '!' || c == '?') {
                counterSentence++;
            }
            if(counterSentence == 2) {
                icebreakers.add(stringBuilder.toString());
                stringBuilder = new StringBuilder();
                icebreakerCounter++;
                counterSentence = 0;
                newSentence = true;
            }
            if(icebreakerCounter == 3) {
                break;
            }

        }

        return icebreakers;
    }
}