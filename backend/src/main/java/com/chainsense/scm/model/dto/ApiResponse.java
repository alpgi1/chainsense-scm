package com.chainsense.scm.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final T data;
    private final String message;
    private final String error;
    private final LocalDateTime timestamp;

    private ApiResponse(boolean success, T data, String message, String error) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static <T> ApiResponse<T> error(String error) {
        return new ApiResponse<>(false, null, null, error);
    }
}
