package com.akilha.auth;

import com.akilha.auth.dto.AuthResponse;
import com.akilha.auth.dto.Credentials;
import com.akilha.message.GenericMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/1.0")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private static final String AUTH_COOKIE_NAME = "Trend-Auth-Token";

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> handleAuthentication(@Valid @RequestBody Credentials credentials) {
        log.debug("Login attempt for user: {}", credentials);

        AuthResponse auth = authService.authenticate(credentials);
        ResponseCookie cookie = ResponseCookie.from(AUTH_COOKIE_NAME, auth.getToken().getToken())
                .httpOnly(true)
               // .secure(true) // HTTPS için
              //  .sameSite("Strict")
                .path("/")
                .build();

        log.info("Login successful for user: {}", credentials.email());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(auth);
    }

    @PostMapping("/logout")
    public ResponseEntity<GenericMessage> handleLogout(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @CookieValue(name = AUTH_COOKIE_NAME, required = false) String cookieToken) {

        String tokenWithPrefix = extractToken(authHeader, cookieToken);

        ResponseCookie cookie = ResponseCookie.from(AUTH_COOKIE_NAME, "")
                .httpOnly(true)
            //    .secure(true)
              //  .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        authService.logout(tokenWithPrefix);

        log.info("Logout successful");

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new GenericMessage("Logout successful"));
    }

    private String extractToken(String authHeader, String cookieToken) {
        if (cookieToken != null) {
            return "Bearer " + cookieToken;
        }
        return authHeader;
    }
}