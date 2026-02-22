package com.akilha.configuration.security;


import com.akilha.user.exception.UserExceptions;
import com.akilha.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class SecurityUtil {
    private static final Logger log = LoggerFactory.getLogger(SecurityUtil.class);


    public void validateUserRole(String... roles) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserExceptions.UnauthorizedException();
        }

        boolean hasAnyRole = Arrays.stream(roles)
                .anyMatch(role -> hasRole(authentication, role));

        if (!hasAnyRole) {
            log.warn("Access denied for user: {}. Required roles: {}",
                    authentication.getName(), String.join(", ", roles));
            throw new UserExceptions.ForbiddenException();
        }
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role.toUpperCase()));
    }

}