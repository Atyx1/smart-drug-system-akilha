package com.akilha.configuration.security;

import com.akilha.configuration.AuthEntryPoint;
import com.akilha.token.TokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final TokenFilter tokenFilter;
    private final AuthEntryPoint authEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/topic/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/1.0/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/1.0/register").permitAll()

                        .requestMatchers(HttpMethod.POST, "/pills/*/drop").permitAll()
                        .requestMatchers(HttpMethod.POST, "/pills/*/tray-emptied").permitAll()
                        .requestMatchers(HttpMethod.POST, "/pills/*/not-taken").permitAll()
                        .requestMatchers(HttpMethod.POST, "/1.0/logout").authenticated()

                        .requestMatchers(
                                "/v1/static/**",
                                "/v1/users/password/reset/**",
                                "/v1/users/password/request",
                                "/v1/users/password/change/activation",
                                "/v1/users/home/**",
                                "/api-docs",             // OpenAPI JSON
                                "/v3/api-docs/**",       // Springdoc JSON (v3)
                                "/swagger-ui.html",      // Swagger UI ana sayfa
                                "/swagger-ui/**",        // Swagger UI static files
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()// <- JS/CSS vs.

                        // USER işlemleri -----------------------------------------------
                        .requestMatchers(HttpMethod.GET, "/v1/users/activate").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/users").permitAll()
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/users/password").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/current").authenticated()
                        .requestMatchers(HttpMethod.PUT,    "/api/v1/users").authenticated()
                        .requestMatchers("/api/v1/users/**").permitAll()

                        // YÖNETİCİ özel -------------------------------------------------
                        .requestMatchers(HttpMethod.POST,   "/api/v1/users/admin").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.POST,   "/api/v1/users/approve/**",
                                "/api/v1/users/set-pending/**",
                                "/api/v1/users/set-manager/**").hasRole("MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/users/admin/**").hasRole("MANAGER")




                        // ACTIVITY LOG --------------------------------------------------
                        .requestMatchers("/api/v1/logs/**").hasRole("MANAGER")

                        // HER ŞEYİN GERİSİ ---------------------------------------------
                        .anyRequest().authenticated()
                )

                // stateless, filtre dizilimi vs.
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(h -> h.authenticationEntryPoint(authEntryPoint))
                .csrf(c -> c.disable())
                .headers(h -> h.disable())
                .addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsFilter corsFilter() {
        CorsConfigurationSource source = corsConfigurationSource();
        return new CorsFilter(source);
    }


    /**
     * CORS configuration to allow requests from specific origins.
     * You can customize the allowed origins, methods, and headers as needed.
     *
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://192.168.1.84:8081"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true); // Allow credentials if needed

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all endpoints
        return source;

    }
}
