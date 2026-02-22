package com.akilha.auth.dto;

import com.akilha.token.Token;
import com.akilha.user.dto.UserDto;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private UserDto user;
    private Token token;
    private String tokenType;

   private  Long deviceId;
}