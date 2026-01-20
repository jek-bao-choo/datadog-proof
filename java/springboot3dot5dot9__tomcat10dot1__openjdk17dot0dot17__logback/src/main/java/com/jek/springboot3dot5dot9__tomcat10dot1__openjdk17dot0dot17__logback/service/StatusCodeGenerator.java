package com.jek.springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback.service;

import org.springframework.stereotype.Component;

import java.util.concurrent.ThreadLocalRandom;

/**
 * Service that generates random HTTP status codes with weighted probability.
 * - 30% chance: 2XX status codes (200, 201, 204)
 * - 40% chance: 4XX status codes (400, 404, 409)
 * - 30% chance: 5XX status codes (500, 503)
 */
@Component
public class StatusCodeGenerator {

    /**
     * Generates a random HTTP status code based on probability distribution.
     * Uses range 0-99 for probability calculation:
     * - 0-29 (30%): Returns 2XX code
     * - 30-69 (40%): Returns 4XX code
     * - 70-99 (30%): Returns 5XX code
     *
     * @return HTTP status code
     */
    public int generateStatusCode() {
        int probability = ThreadLocalRandom.current().nextInt(100); // 0-99

        if (probability < 30) { // 0-29: 30%
            return get2xxCode();
        } else if (probability < 70) { // 30-69: 40%
            return get4xxCode();
        } else { // 70-99: 30%
            return get5xxCode();
        }
    }

    /**
     * Returns a random 2XX status code.
     * Options: 200 (OK), 201 (Created), 204 (No Content)
     */
    private int get2xxCode() {
        int[] codes = {200, 201, 204};
        int index = ThreadLocalRandom.current().nextInt(codes.length);
        return codes[index];
    }

    /**
     * Returns a random 4XX status code.
     * Options: 400 (Bad Request), 404 (Not Found), 409 (Conflict)
     */
    private int get4xxCode() {
        int[] codes = {400, 404, 409};
        int index = ThreadLocalRandom.current().nextInt(codes.length);
        return codes[index];
    }

    /**
     * Returns a random 5XX status code.
     * Options: 500 (Internal Server Error), 503 (Service Unavailable)
     */
    private int get5xxCode() {
        int[] codes = {500, 503};
        int index = ThreadLocalRandom.current().nextInt(codes.length);
        return codes[index];
    }
}
