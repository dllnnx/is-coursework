package ru.itmo.accontrol.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import ru.itmo.accontrol.dto.YandexUserInfo;

@Service
@Slf4j
public class YandexApiService {

    private static final String YANDEX_USER_INFO_URL = "https://login.yandex.ru/info";
    
    private final RestClient restClient;

    public YandexApiService() {
        this.restClient = RestClient.builder()
                .baseUrl(YANDEX_USER_INFO_URL)
                .build();
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
            YandexUserInfo userInfo = restClient.get()
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
