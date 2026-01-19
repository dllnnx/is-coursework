package ru.itmo.accontrol.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import ru.itmo.accontrol.security.YandexOAuth2UserService;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final YandexOAuth2UserService yandexOAuth2UserService;

    /**
     * Development profile - all endpoints open, but OAuth2 login available for testing
     */
    @Bean
    @Profile("dev")
    public SecurityFilterChain developmentSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(yandexOAuth2UserService)
                        )
                        .defaultSuccessUrl("/api/auth/me", true)
                );
        return http.build();
    }

    /**
     * Production profile - authentication required, only approved users can access protected endpoints
     */
    @Bean
    @Profile("prod")
    public SecurityFilterChain productionSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info", "/actuator/prometheus").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/**").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(yandexOAuth2UserService)
                        )
                        .defaultSuccessUrl("/api/auth/me", true)
                );
        return http.build();
    }

    /**
     * Default profile (no profile specified) - same as dev
     */
    @Bean
    @Profile("default")
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(yandexOAuth2UserService)
                        )
                        .defaultSuccessUrl("/api/auth/me", true)
                );
        return http.build();
    }
}
