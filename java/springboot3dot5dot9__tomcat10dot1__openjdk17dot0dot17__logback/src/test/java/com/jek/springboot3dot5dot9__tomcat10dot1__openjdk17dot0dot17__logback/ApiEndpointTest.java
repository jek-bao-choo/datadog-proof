package com.jek.springboot3dot5dot9__tomcat10dot1__openjdk17dot0dot17__logback;

import com.microsoft.playwright.APIRequest;
import com.microsoft.playwright.APIRequestContext;
import com.microsoft.playwright.APIResponse;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.RequestOptions;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for API endpoints using Playwright.
 * Tests all three endpoints and verifies random status code behavior.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ApiEndpointTest {

    @LocalServerPort
    private int port;

    private static Playwright playwright;
    private static APIRequestContext request;

    @BeforeAll
    static void beforeAll() {
        playwright = Playwright.create();
    }

    @BeforeEach
    void setUp() {
        request = playwright.request().newContext(new APIRequest.NewContextOptions()
                .setBaseURL("http://localhost:" + port));
    }

    @AfterEach
    void tearDown() {
        if (request != null) {
            request.dispose();
        }
    }

    @AfterAll
    static void afterAll() {
        if (playwright != null) {
            playwright.close();
        }
    }

    /**
     * Test GET /api/data endpoint.
     * Verifies valid status code is returned.
     */
    @Test
    @Order(1)
    void testGetEndpoint() {
        APIResponse response = request.get("/api/data");

        assertNotNull(response, "Response should not be null");

        // Verify status code is one of the expected values
        int statusCode = response.status();
        assertTrue(isValidStatusCode(statusCode),
                "Status code should be 2XX, 4XX, or 5XX, got: " + statusCode);

        System.out.println("GET /api/data - Status: " + statusCode);
    }

    /**
     * Test POST /api/submit endpoint.
     * Verifies endpoint accepts JSON payload and returns valid status code.
     */
    @Test
    @Order(2)
    void testPostEndpoint() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("test", "data");
        payload.put("user", "playwright-test");

        APIResponse response = request.post("/api/submit",
                RequestOptions.create().setData(payload));

        assertNotNull(response, "Response should not be null");

        // Verify status code is one of the expected values
        int statusCode = response.status();
        assertTrue(isValidStatusCode(statusCode),
                "Status code should be 2XX, 4XX, or 5XX, got: " + statusCode);

        System.out.println("POST /api/submit - Status: " + statusCode);
    }

    /**
     * Test PUT /api/update endpoint.
     * Verifies endpoint returns valid status code with no body.
     */
    @Test
    @Order(3)
    void testPutEndpoint() {
        APIResponse response = request.put("/api/update");

        assertNotNull(response, "Response should not be null");

        // Verify status code is one of the expected values
        int statusCode = response.status();
        assertTrue(isValidStatusCode(statusCode),
                "Status code should be 2XX, 4XX, or 5XX, got: " + statusCode);

        System.out.println("PUT /api/update - Status: " + statusCode);
    }

    /**
     * Test status code variation across multiple requests.
     * Verifies that the random status code generator works by making
     * multiple requests and ensuring different codes are returned.
     */
    @Test
    @Order(4)
    void testStatusCodeVariation() {
        Set<Integer> statusCodes = new HashSet<>();
        int numberOfRequests = 20;

        // Make multiple requests to GET endpoint
        for (int i = 0; i < numberOfRequests; i++) {
            APIResponse response = request.get("/api/data");
            statusCodes.add(response.status());
        }

        // Should have at least 2 different status codes
        assertTrue(statusCodes.size() >= 2,
                "Expected at least 2 different status codes from " + numberOfRequests +
                        " requests, got: " + statusCodes);

        System.out.println("Status code variation test - Unique codes: " + statusCodes);
        System.out.println("Distribution: " + statusCodes.size() + " different codes from " +
                numberOfRequests + " requests");
    }

    /**
     * Test probability distribution of status codes.
     * Verifies roughly correct distribution across many requests.
     */
    @Test
    @Order(5)
    void testStatusCodeProbability() {
        int numberOfRequests = 100;
        int count2xx = 0;
        int count4xx = 0;
        int count5xx = 0;

        // Make many requests and count status code types
        for (int i = 0; i < numberOfRequests; i++) {
            APIResponse response = request.get("/api/data");
            int statusCode = response.status();

            if (statusCode >= 200 && statusCode < 300) {
                count2xx++;
            } else if (statusCode >= 400 && statusCode < 500) {
                count4xx++;
            } else if (statusCode >= 500 && statusCode < 600) {
                count5xx++;
            }
        }

        // Verify we got responses in all three categories
        assertTrue(count2xx > 0, "Should have some 2XX responses");
        assertTrue(count4xx > 0, "Should have some 4XX responses");
        assertTrue(count5xx > 0, "Should have some 5XX responses");

        // Print distribution
        System.out.println("Probability distribution from " + numberOfRequests + " requests:");
        System.out.println("  2XX: " + count2xx + " (" + (count2xx * 100.0 / numberOfRequests) + "%)");
        System.out.println("  4XX: " + count4xx + " (" + (count4xx * 100.0 / numberOfRequests) + "%)");
        System.out.println("  5XX: " + count5xx + " (" + (count5xx * 100.0 / numberOfRequests) + "%)");

        // Rough check: 2XX should be around 30%, 4XX around 40%, 5XX around 30%
        // Allow generous margin (15-45% for 30%, 25-55% for 40%)
        assertTrue(count2xx >= 15 && count2xx <= 45,
                "2XX should be ~30% (15-45%), got: " + count2xx + "%");
        assertTrue(count4xx >= 25 && count4xx <= 55,
                "4XX should be ~40% (25-55%), got: " + count4xx + "%");
        assertTrue(count5xx >= 15 && count5xx <= 45,
                "5XX should be ~30% (15-45%), got: " + count5xx + "%");
    }

    /**
     * Helper method to check if status code is valid.
     * Valid codes: 200, 201, 204, 400, 404, 409, 500, 503
     */
    private boolean isValidStatusCode(int statusCode) {
        return statusCode == 200 || statusCode == 201 || statusCode == 204 ||
                statusCode == 400 || statusCode == 404 || statusCode == 409 ||
                statusCode == 500 || statusCode == 503;
    }
}
