package com.akilha.token;

import com.akilha.auth.dto.Credentials;
import com.akilha.user.entity.Role;
import com.akilha.user.entity.User;
import com.akilha.user.exception.UserExceptions;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;



    @Service
    @RequiredArgsConstructor
    @ConditionalOnProperty(value = "trend.token-type", havingValue = "JWT")
    public class JwtTokenService implements TokenService {
        private static final Logger log = LoggerFactory.getLogger(JwtTokenService.class);
        private final KeyPair keyPair;
        private final Set<String> tokenBlacklist = new HashSet<>();
        private final ObjectMapper objectMapper = new ObjectMapper();

        private final TokenRepository tokenRepository;



        @Override
        public Token createToken(User user, Credentials credentials) {
            try {
                TokenSubject tokenSubject = new TokenSubject(
                        user.getId(),
                        user.getEmail(),
                        user.getUsername(),
                        System.currentTimeMillis(),
                        user.isActive()
                );

                String subject = objectMapper.writeValueAsString(tokenSubject);
                String tokenString = Jwts.builder()
                        .setSubject(subject)
                        .claim("role", user.getRole().name())
                        .setIssuedAt(new Date())
                        .signWith(keyPair.getPrivate(), SignatureAlgorithm.RS256)
                        .compact();

                Token newToken = new Token("Bearer", tokenString);
                newToken.setUserId(user.getId());


                Token existingToken = tokenRepository.findByUserId(user.getId());
                if (existingToken != null) {
                    existingToken.setToken(tokenString);
                    return tokenRepository.save(existingToken);
                }

                return tokenRepository.save(newToken);
            } catch (JsonProcessingException e) {
                log.error("Error creating token", e);
                throw new UserExceptions.InvalidTokenException();
            }
        }

        @Override
        public User verifyToken(String authorizationHeader) {
            try {
                if (authorizationHeader == null || authorizationHeader.isBlank()) {
                    log.error("Authorization header is missing or blank");
                    throw new UserExceptions.TokenHeaderMissingException();
                }

                String[] parts = authorizationHeader.split(" ");
                if (parts.length != 2) {
                    log.error("Invalid authorization header format");
                    throw new UserExceptions.InvalidTokenFormatException();
                }

                String token = parts[1];
                if (tokenBlacklist.contains(token)) {
                    log.error("Token is blacklisted");
                    throw new UserExceptions.BlacklistedTokenException();
                }



                Token storedToken = tokenRepository.findByToken(token);
                if (storedToken == null) {
                    log.error("Token not found in database");
                    throw new UserExceptions.TokenNotFoundException();
                }

                JwtParser parser = Jwts.parserBuilder()
                        .setSigningKey(keyPair.getPublic())   // veya publicKey
                        .build();
                Jws<Claims> claims = parser.parseClaimsJws(token);

                String subject = claims.getBody().getSubject();
                TokenSubject tokenSubject = objectMapper.readValue(subject, TokenSubject.class);
                String role = claims.getBody().get("role", String.class);

                User user = new User();
                user.setId(tokenSubject.userId());
                user.setEmail(tokenSubject.email());
                user.setUsername(tokenSubject.username());
                user.setActive(tokenSubject.active());
                user.setRole(Role.valueOf(role));

                return user;

            } catch (JwtException | JsonProcessingException e) {
                log.error("Error verifying token", e);
                throw new UserExceptions.TokenVerificationException();
            }
        }

        @Override
        public void deleteToken(String authorizationHeader) {
            try {
                if (authorizationHeader == null || authorizationHeader.isBlank()) {
                    log.error("No token to delete");
                    throw new UserExceptions.TokenHeaderMissingException();
                }

                String token = authorizationHeader.split(" ")[1];

                tokenRepository.deleteByToken(token);
                tokenBlacklist.add(token);

                log.info("Token successfully deleted and blacklisted");
            } catch (Exception e) {
                log.error("Error deleting token", e);
                throw new UserExceptions.TokenDeletionException();
            }
        }

        @Override
        public boolean isUserHaveToken(User user) {
            return tokenRepository.existsByUserId(user.getId());
        }

        public static record TokenSubject(
                long userId,
                String email,
                String username,
                long createdAt,
                boolean active
        ) {}
    }