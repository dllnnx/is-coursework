package ru.itmo.accontrol.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import ru.itmo.accontrol.dto.YandexUserInfo;

@Service
@Slf4j
public class YandexApiService {

    private static final String YANDEX_USER_INFO_URL = "https://login.yandex.ru/info";
    private static final String YANDEX_TOKEN_URL = "https://oauth.yandex.ru/token";

    private final RestClient userInfoClient;
    private final RestClient tokenClient;
    private final String clientId;
    private final String clientSecret;

    public YandexApiService(
            @Value("${spring.security.oauth2.client.registration.yandex.client-id}") String clientId,
            @Value("${spring.security.oauth2.client.registration.yandex.client-secret}") String clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.userInfoClient = RestClient.builder()
                .baseUrl(YANDEX_USER_INFO_URL)
                .build();
        this.tokenClient = RestClient.builder()
                .baseUrl(YANDEX_TOKEN_URL)
                .build();
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class YandexTokenResponse {
        @JsonProperty("access_token")
        private String accessToken;

        @JsonProperty("token_type")
        private String tokenType;

        @JsonProperty("expires_in")
        private Long expiresIn;

        @JsonProperty("refresh_token")
        private String refreshToken;
    }

    public String exchangeCodeForToken(String code, String redirectUri) {
        log.info("Exchanging authorization code for token");

        try {
            String requestBody = String.format(
                    "grant_type=authorization_code&code=%s&client_id=%s&client_secret=%s&redirect_uri=%s",
                    code, clientId, clientSecret, redirectUri
            );

            YandexTokenResponse tokenResponse = tokenClient.post()
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(requestBody)
                    .retrieve()
                    .body(YandexTokenResponse.class);

            if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
                throw new RuntimeException("Failed to exchange code for token: empty response");
            }

            log.info("Successfully exchanged code for token");
            return tokenResponse.getAccessToken();

        } catch (Exception e) {
            log.error("Failed to exchange code for token", e);
            throw new RuntimeException("Failed to exchange code for token: " + e.getMessage(), e);
        }
    }

    /**
     * Fetches user information from Yandex API using the provided OAuth token.
     *
     * @param oauthToken the OAuth token obtained from Yandex
     * @return YandexUserInfo containing user details
     * @throws RuntimeException if the request fails
     */
    public YandexUserInfo getUserInfo(String oauthToken) {
        log.info("Fetching user info from Yandex API");
        
        try {
            YandexUserInfo userInfo = userInfoClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("format", "json")
                            .build())
                    .header(HttpHeaders.AUTHORIZATION, "OAuth " + oauthToken)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(YandexUserInfo.class);
            
            if (userInfo == null || userInfo.getId() == null) {
                throw new RuntimeException("Failed to get user info from Yandex: empty response");
            }
            
            log.info("Successfully fetched user info: id={}, login={}", userInfo.getId(), userInfo.getLogin());
            return userInfo;
            
        } catch (Exception e) {
            log.error("Failed to fetch user info from Yandex API", e);
            throw new RuntimeException("Failed to get user info from Yandex: " + e.getMessage(), e);
        }
    }
}
