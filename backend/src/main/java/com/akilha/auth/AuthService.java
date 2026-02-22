package com.akilha.auth;

import com.akilha.auth.dto.AuthResponse;
import com.akilha.auth.dto.Credentials;
import com.akilha.device.service.DeviceService;
import com.akilha.logging.service.ActivityLogService;
import com.akilha.token.Token;
import com.akilha.token.TokenService;
import com.akilha.user.entity.User;
import com.akilha.user.dto.UserDto;
import com.akilha.user.service.UserService;
import com.akilha.user.exception.UserExceptions;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String TOKEN_TYPE = "Bearer";

    private final UserService userService;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;
    private  final DeviceService deviceService;

    @Transactional
    public AuthResponse authenticate(@Valid Credentials credentials) {
        // Kullanıcıyı bul
        User user = validateAndGetUser(credentials.email(), credentials.password());
        // Şifre kontrolü
        validatePassword(credentials.password(), user);
        // Token oluştur
        Token token = createTokenForUser(user, credentials);
        


        // Response oluştur
        return createAuthResponse(user, token);
    }

    @Transactional
    public void logout(String authorizationHeader) {
    
        if (authorizationHeader == null || !authorizationHeader.startsWith(TOKEN_TYPE + " ")) {
            log.warn("Invalid authorization header format: {}", authorizationHeader);
            throw new UserExceptions.InvalidTokenException();
        }
    
        log.debug("Logout requested. Auth header = '{}'", authorizationHeader);
    
        try {
            /* 1) TOKEN DOĞRULAMA */
            User user = tokenService.verifyToken(authorizationHeader);
            log.debug("verifyToken -> userId={}, email={}", user.getId(), user.getEmail());
    

            tokenService.deleteToken(authorizationHeader);

            log.info("User logged out successfully");
        } catch (Exception e) {

            throw new UserExceptions.AuthenticationException();
        }
    }

    
    private User validateAndGetUser(String email,String rawPassword) {
        User user = userService.findByEmail(email);

        if (user == null) {
            log.warn("Authentication attempt with non-existent email: {}", email);
            

            
            throw new UserExceptions.EmailNotFoundException();
        }

        if (!user.isActive()) {
            log.warn("Authentication attempt for inactive user: {}", email);
            
            // Aktif olmayan kullanıcı giriş denemesi
            String logDescription = String.format(
                    "%s kullanıcısı aktif olmadığı halde giriş denedi",
                    user.getUsername()
            );
            

            
            throw new UserExceptions.NotActiveUserException();
        }

        return user;
    }

    private void validatePassword(String rawPassword, User user) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {

            
            throw new UserExceptions.AuthenticationException();
        }
        
        if (tokenService.isUserHaveToken(user)) {

            throw new UserExceptions.AlreadyLoggedException();
        }
    }

    private Token createTokenForUser(User user, Credentials credentials) {
        try {
            Token token = tokenService.createToken(user, credentials);
            log.info("Token created successfully for user: {}", user.getEmail());
            return token;
        } catch (Exception e) {
            log.error("Error creating token for user: {}", user.getEmail(), e);
            

            throw new UserExceptions.AuthenticationException();
        }
    }

    private AuthResponse createAuthResponse(User user, Token token) {

        Long deviceId = deviceService.findDeviceIdByUserEmail(user.getEmail());
        try {
            return AuthResponse.builder()
                    .user(new UserDto(user))
                    .token(token)
                    .tokenType(TOKEN_TYPE)
                    .deviceId(deviceId)
                    .build();
        } catch (Exception e) {
            log.error("Error creating auth response for user: {}", user.getEmail(), e);
            

            
            throw new UserExceptions.AuthenticationException();
        }
    }
}