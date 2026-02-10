package com.jekbao.springboot4dot0dot2__openjdk21__payload2customtags;

import io.opentelemetry.api.trace.Span;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class PayloadToSpanTagsController {

    @GetMapping("/payload-to-spantags")
    public ResponseEntity<Map<String, Object>> addSpanTags(
            @RequestBody Map<String, String> payload) {

        if (payload == null || payload.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Payload must be a non-empty JSON object with key-value pairs"
            ));
        }

        try {
            Span span = Span.current();

            for (Map.Entry<String, String> entry : payload.entrySet()) {
                span.setAttribute(entry.getKey(), entry.getValue());
            }

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "tagsAdded", payload.size(),
                "tags", payload
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }
}
