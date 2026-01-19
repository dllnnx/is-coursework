package ru.itmo.accontrol.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import ru.itmo.accontrol.entity.RegistrationRequest;
import ru.itmo.accontrol.entity.User;
import ru.itmo.accontrol.repository.RegistrationRequestRepository;
import ru.itmo.accontrol.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class YandexOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RegistrationRequestRepository registrationRequestRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String yandexId = extractYandexId(oauth2User);
        String email = extractEmail(oauth2User);
        String name = extractName(oauth2User);
        
        log.info("OAuth2 login attempt: yandexId={}, email={}, name={}", yandexId, email, name);
        
        // Check if user exists, if not - create with pending status
        Optional<User> existingUser = userRepository.findByYandexId(yandexId);
        
        if (existingUser.isEmpty()) {
            log.info("Creating new user with pending registration: {}", yandexId);
            User newUser = User.builder()
                    .yandexId(yandexId)
                    .email(email != null ? email : yandexId + "@yandex.ru")
                    .name(name != null ? name : "User " + yandexId)
                    .build();
            User savedUser = userRepository.save(newUser);
            
            RegistrationRequest request = RegistrationRequest.builder()
                    .user(savedUser)
                    .status("pending")
                    .build();
            registrationRequestRepository.save(request);
            
            log.info("Created user with id={} and pending registration request", savedUser.getId());
        } else {
            log.info("User already exists: id={}", existingUser.get().getId());
        }
        
        return new YandexOAuth2User(oauth2User, yandexId);
    }
    
    private String extractYandexId(OAuth2User oauth2User) {
        // Yandex returns 'id' as the user identifier
        Object id = oauth2User.getAttribute("id");
        if (id != null) {
            return id.toString();
        }
        // Fallback to 'login' if 'id' is not present
        Object login = oauth2User.getAttribute("login");
        return login != null ? login.toString() : oauth2User.getName();
    }
    
    private String extractEmail(OAuth2User oauth2User) {
        Object email = oauth2User.getAttribute("default_email");
        if (email != null) {
            return email.toString();
        }
        // Try alternative field
        Object emails = oauth2User.getAttribute("emails");
        if (emails instanceof Iterable<?> emailList) {
            for (Object e : emailList) {
                return e.toString();
            }
        }
        return null;
    }
    
    private String extractName(OAuth2User oauth2User) {
        // Try real_name first
        Object realName = oauth2User.getAttribute("real_name");
        if (realName != null && !realName.toString().isBlank()) {
            return realName.toString();
        }
        // Fallback to display_name
        Object displayName = oauth2User.getAttribute("display_name");
        if (displayName != null) {
            return displayName.toString();
        }
        // Fallback to login
        Object login = oauth2User.getAttribute("login");
        return login != null ? login.toString() : null;
    }
}
