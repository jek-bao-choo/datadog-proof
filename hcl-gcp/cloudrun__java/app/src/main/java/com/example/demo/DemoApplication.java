package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@SpringBootApplication
@RestController
public class DemoApplication {

    private static final Logger logger = Logger.getLogger(DemoApplication.class.getName());

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    /**
     * Main endpoint - returns a simple greeting
     */
    @GetMapping("/")
    public Map<String, String> hello() {
        logger.info("Hello endpoint called");

        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Cloud Run!");
        response.put("service", "cloudrun-java-demo");
        response.put("version", "1.0.0");

        return response;
    }

    /**
     * Info endpoint - returns application information
     */
    @GetMapping("/info")
    public Map<String, Object> info() {
        logger.info("Info endpoint called");

        Map<String, Object> info = new HashMap<>();
        info.put("application", "Cloud Run Java Demo");
        info.put("description", "Spring Boot app with JVM metrics");
        info.put("javaVersion", System.getProperty("java.version"));
        info.put("osName", System.getProperty("os.name"));

        // Memory information
        Runtime runtime = Runtime.getRuntime();
        Map<String, Long> memory = new HashMap<>();
        memory.put("totalMemory", runtime.totalMemory());
        memory.put("freeMemory", runtime.freeMemory());
        memory.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
        memory.put("maxMemory", runtime.maxMemory());
        info.put("memory", memory);

        return info;
    }
}
