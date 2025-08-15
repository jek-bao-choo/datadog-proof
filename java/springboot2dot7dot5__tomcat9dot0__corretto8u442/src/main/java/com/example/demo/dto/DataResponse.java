package com.example.demo.dto;

import java.time.LocalDateTime;

public class DataResponse {
    private String message;
    private int randomNumber;
    private LocalDateTime timestamp;

    // Constructors, getters, and setters
    public DataResponse() {}

    public DataResponse(String message, int randomNumber, LocalDateTime timestamp) {
        this.message = message;
        this.randomNumber = randomNumber;
        this.timestamp = timestamp;
    }

    // Getters and setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getRandomNumber() { return randomNumber; }
    public void setRandomNumber(int randomNumber) { this.randomNumber = randomNumber; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}