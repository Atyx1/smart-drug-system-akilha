package com.akilha.token;


import com.akilha.configuration.security.CurrentUser;
import com.akilha.user.entity.User;
import com.akilha.user.exception.UserExceptions;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class TokenFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    @Qualifier("handlerExceptionResolver")
    @Autowired
    private HandlerExceptionResolver resolver;

    private static final Logger log = LoggerFactory.getLogger(TokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String tokenWithPrefix = getTokenWithPrefix(request);
            if (tokenWithPrefix != null) {
                User user = tokenService.verifyToken(tokenWithPrefix);
                if (user == null) {
                    log.warn("Invalid token");
                    throw new UserExceptions.InvalidTokenException();
                }

                if (!user.isActive()) {
                    log.warn("User is not active");
                    throw new UserExceptions.NotActiveUserException();
                }

                CurrentUser currentUser = new CurrentUser(user);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(currentUser, null, currentUser.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            filterChain.doFilter(request, response);
        } catch (UserExceptions.InvalidTokenException | UserExceptions.NotActiveUserException e) {
            resolver.resolveException(request, response, null, e);
        }
    }

    private String getTokenWithPrefix(HttpServletRequest request) {
        var tokenWithPrefix = request.getHeader("Authorization");
        var cookies = request.getCookies();
        if (cookies == null) return tokenWithPrefix;

        for (var cookie : cookies) {
            if (!cookie.getName().equals("Trend-Auth-Token")) continue;
            if (cookie.getValue() == null || cookie.getValue().isEmpty()) continue;
            return "AnyPrefix " + cookie.getValue();
        }
        return tokenWithPrefix;
    }
}
