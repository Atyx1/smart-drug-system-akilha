package com.akilha.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record Credentials(
        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size
        String password
) {}