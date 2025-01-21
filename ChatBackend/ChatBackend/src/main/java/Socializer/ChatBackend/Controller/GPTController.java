package Socializer.ChatBackend.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import Socializer.ChatBackend.HelperClasses.IcebreakerExtractor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GPTController {

    private final String PYTHON_API_URL = "http://127.0.0.1:5000/generate";

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> requestBody) {
        // Extract the input text from the request body
        String inputText = requestBody.get("input");
        if (inputText == null || inputText.isEmpty()) {
            return ResponseEntity.badRequest().body("Input text is required.");
        }

        // Prepare the payload for the Python API
        Map<String, String> payload = new HashMap<>();
        payload.put("input", inputText);

        // Send the POST request to the Python API
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_API_URL, payload, Map.class);

        // Check if the response contains the output
        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null || !responseBody.containsKey("output")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Invalid response from the Python API.");
        }

        String outputText = responseBody.get("output").toString();

        // Call trimInputFromOutput to get the trimmed output
        String trimmedOutput;
        try {
            trimmedOutput = IcebreakerExtractor.trimInputFromOutput(inputText, outputText);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

        // Call getIcebreakers to extract three icebreakers
        ArrayList<String> icebreakers = IcebreakerExtractor.getIcebreakers(trimmedOutput);

        // Prepare the response with icebreakers
        Map<String, String> icebreakerResponse = new HashMap<>();
        for (int i = 0; i < icebreakers.size(); i++) {
            icebreakerResponse.put("Icebreaker " + (i + 1), icebreakers.get(i));
        }

        return ResponseEntity.ok(icebreakerResponse);
    }

}