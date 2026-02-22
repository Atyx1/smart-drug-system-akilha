package com.akilha.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private T data;
    private String path;
    private Map<String, String> validationErrors;

    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }
}