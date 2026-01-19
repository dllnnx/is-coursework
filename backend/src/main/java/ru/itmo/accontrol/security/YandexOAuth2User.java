package ru.itmo.accontrol.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
public class YandexOAuth2User implements OAuth2User {

    private final OAuth2User delegate;
    private final String yandexId;

    public YandexOAuth2User(OAuth2User delegate, String yandexId) {
        this.delegate = delegate;
        this.yandexId = yandexId;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return delegate.getAuthorities();
    }

    @Override
    public String getName() {
        return yandexId;
    }
}
