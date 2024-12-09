package Socializer.ChatBackend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GPTController {

    private final String PYTHON_API_URL = "http://127.0.0.1:5000/generate";

    @GetMapping("/generate") // Changed to GET for hardcoded example
    public ResponseEntity<?> generate() {
        // Hardcoded input text
        String inputText = "Hi, I’m Ethan. I love rock climbing, playing guitar, and studying data science.";
        Map<String, String> payload = new HashMap<>();
        payload.put("input", inputText);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_API_URL, payload, Map.class);
        System.out.println(response.getBody());
        return ResponseEntity.ok(response.getBody());
    }
}