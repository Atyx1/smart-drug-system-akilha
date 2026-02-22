package com.akilha.message;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Map;

public class ResponseBuilder {

    // Genel yapılandırıcı metot (Tüm yanıtlar için ortak)
    private static <T> ResponseEntity<ApiResponse<T>> buildResponse(HttpStatus status, String message, T data, String path, Map<String, String> validationErrors) {
        return ResponseEntity.status(status)
                .body(ApiResponse.<T>builder()
                        .status(status.value())
                        .message(message)
                        .data(data)
                        .path(path)
                        .validationErrors(validationErrors)
                        .timestamp(LocalDateTime.now())
                        .build());
    }

    // Başarılı işlemler için
    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        return buildResponse(HttpStatus.OK, message, data, null, null);
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        return buildResponse(HttpStatus.CREATED, message,null, null, null);
    }


    // Hata durumları için
    public static <T> ResponseEntity<ApiResponse<T>> error(HttpStatus status, String message) {
        return buildResponse(status, message, null, null, null);
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(HttpStatus status, String message, String path) {
        return buildResponse(status, message, null, path, null);
    }


}