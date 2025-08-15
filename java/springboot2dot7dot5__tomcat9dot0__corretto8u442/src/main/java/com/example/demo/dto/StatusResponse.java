package com.example.demo.dto;

import java.time.LocalDateTime;

public class StatusResponse {
    private int httpStatus;
    private String message;
    private LocalDateTime timestamp;

    public StatusResponse() {}

    public StatusResponse(int httpStatus, String message, LocalDateTime timestamp) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.timestamp = timestamp;
    }

    public int getHttpStatus() { return httpStatus; }
    public void setHttpStatus(int httpStatus) { this.httpStatus = httpStatus; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}