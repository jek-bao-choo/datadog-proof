package com.jek.springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback.controller;

import com.jek.springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback.service.StatusCodeGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

/**
 * REST API Controller with three endpoints.
 * Each endpoint has different logging configuration:
 * - GET /api/data: Logs to Console (JSON format)
 * - POST /api/submit: Logs to Syslog (JSON format)
 * - PUT /api/update: Logs to File (JSON format)
 */
@RestController
@RequestMapping("/api")
public class ApiController {

    // Logger for GET endpoint - logs to Console
    private static final Logger GET_LOGGER = LoggerFactory.getLogger("com.jek.springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback.controller.GetEndpoint");

    // Logger for POST endpoint - logs to Syslog
    private static final Logger POST_LOGGER = LoggerFactory.getLogger("com.jek.springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback.controller.PostEndpoint");

    // Logger for PUT endpoint - logs to File
    private static final Logger PUT_LOGGER = LoggerFactory.getLogger("com.jek.springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback.controller.PutEndpoint");

    private final StatusCodeGenerator statusCodeGenerator;

    /**
     * Constructor injection of StatusCodeGenerator.
     */
    public ApiController(StatusCodeGenerator statusCodeGenerator) {
        this.statusCodeGenerator = statusCodeGenerator;
    }

    /**
     * GET endpoint that returns dummy data with 5-digit random number.
     * Logs to Console in JSON format.
     * Returns random status code based on probability.
     *
     * @return ResponseEntity with dummy data and random status code
     */
    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getData() {
        // Generate random status code
        int statusCode = statusCodeGenerator.generateStatusCode();

        // Generate 5-digit random number (10000-99999)
        int randomNumber = ThreadLocalRandom.current().nextInt(10000, 100000);

        // Create lorem ipsum dummy text
        String loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

        // Create response data
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("randomNumber", randomNumber);
        responseData.put("loremIpsum", loremIpsum);
        responseData.put("statusCode", statusCode);
        responseData.put("timestamp", System.currentTimeMillis());

        // Log to Console (JSON format)
        GET_LOGGER.info("GET /api/data - Status: {} - RandomNumber: {}", statusCode, randomNumber);

        // Return response with generated status code
        return ResponseEntity.status(statusCode).body(responseData);
    }

    /**
     * POST endpoint that accepts JSON payload.
     * Logs to Syslog in JSON format.
     * Returns random status code based on probability.
     *
     * @param payload Request body as Map
     * @return ResponseEntity with response message and random status code
     */
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitData(@RequestBody Map<String, Object> payload) {
        // Generate random status code
        int statusCode = statusCodeGenerator.generateStatusCode();

        // Create response data
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("status", "received");
        responseData.put("message", "Data submitted successfully");
        responseData.put("receivedPayload", payload);
        responseData.put("statusCode", statusCode);
        responseData.put("timestamp", System.currentTimeMillis());

        // Log to Syslog (JSON format)
        POST_LOGGER.info("POST /api/submit - Status: {} - Payload: {}", statusCode, payload);

        // Return response with generated status code
        return ResponseEntity.status(statusCode).body(responseData);
    }

    /**
     * PUT endpoint that returns only status code.
     * Logs to File (logs/app.log) in JSON format.
     * Returns random status code based on probability.
     *
     * @return ResponseEntity with only status code (no body)
     */
    @PutMapping("/update")
    public ResponseEntity<Void> updateData() {
        // Generate random status code
        int statusCode = statusCodeGenerator.generateStatusCode();

        // Log to File (JSON format)
        PUT_LOGGER.info("PUT /api/update - Status: {}", statusCode);

        // Return response with only status code (no body)
        return ResponseEntity.status(statusCode).build();
    }
}
