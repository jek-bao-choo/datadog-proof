package com.example.demo.controller;

import com.example.demo.dto.DataResponse;
import com.example.demo.dto.SubmitResponse;
import com.example.demo.dto.StatusResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class ApiController {

    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);
    private final Random random = new Random();

    @GetMapping("/data")
    public DataResponse getData() {
        int randomNumber = random.nextInt(1000);
        LocalDateTime timestamp = LocalDateTime.now();
        
        logger.info("GET /api/data called - Random number: {}, Timestamp: {}", randomNumber, timestamp);
        
        return new DataResponse("Hello from GET endpoint", randomNumber, timestamp);
    }

    @PostMapping("/submit")
    public SubmitResponse submitData(@RequestBody(required = false) Object data) {
        logger.info("POST /api/submit called - Payload: {}", data);
        
        return new SubmitResponse("success", "Data received");
    }

    @PutMapping("/status")
    public StatusResponse getStatus() {
        LocalDateTime timestamp = LocalDateTime.now();
        
        logger.info("PUT /api/status called - Timestamp: {}", timestamp);
        
        return new StatusResponse(200, "PUT request processed successfully", timestamp);
    }
}