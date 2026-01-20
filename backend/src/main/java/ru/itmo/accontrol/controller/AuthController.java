package ru.itmo.accontrol.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.accontrol.dto.AuthResponse;
import ru.itmo.accontrol.dto.OAuthCallbackRequest;
import ru.itmo.accontrol.dto.UserDto;
import ru.itmo.accontrol.dto.YandexUserInfo;
import ru.itmo.accontrol.entity.User;
import ru.itmo.accontrol.mapper.UserMapper;
import ru.itmo.accontrol.security.JwtService;
import ru.itmo.accontrol.security.YandexOAuth2User;
import ru.itmo.accontrol.service.UserService;
import ru.itmo.accontrol.service.YandexApiService;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Authentication and user session API")
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final YandexApiService yandexApiService;
    private final JwtService jwtService;

    @PostMapping("/callback")
    @Operation(summary = "Handle OAuth callback",
            description = "Exchanges authorization code for tokens, creates/finds user, and returns JWT")
    public ResponseEntity<AuthResponse> handleOAuthCallback(@Valid @RequestBody OAuthCallbackRequest request) {
        log.info("Processing OAuth callback");

        String yandexToken = yandexApiService.exchangeCodeForToken(request.getCode(), request.getRedirectUri());

        YandexUserInfo yandexInfo = yandexApiService.getUserInfo(yandexToken);

        Optional<User> existingUser = userService.findByYandexId(yandexInfo.getId());
        boolean isNewUser = existingUser.isEmpty();

        User user;
        if (isNewUser) {
            log.info("Creating new user for yandexId: {}", yandexInfo.getId());
            User newUser = User.builder()
                    .yandexId(yandexInfo.getId())
                    .name(yandexInfo.getBestName())
                    .email(yandexInfo.getBestEmail())
                    .build();
            user = userService.createWithPendingRequest(newUser);
        } else {
            user = existingUser.get();
            log.info("Found existing user: id={}", user.getId());
        }

        String jwtToken = jwtService.generateToken(user);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .user(userMapper.toDto(user))
                .expiresIn(jwtService.getExpirationMs())
                .newUser(isNewUser)
                .build());
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user",
            description = "Returns the currently authenticated user info and registration status")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Object principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "authenticated", false,
                            "message", "Not authenticated"
                    ));
        }

        if (principal instanceof User user) {
            User reloadedUser = userService.findByIdWithRelations(Long.valueOf(user.getId()));
            UserDto userDto = userMapper.toDto(reloadedUser);
            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "user", userDto,
                    "accessGranted", "approved".equals(userDto.getRegistrationStatus())
            ));
        }

        if (principal instanceof OAuth2User oauth2User) {
            String yandexId;
            if (oauth2User instanceof YandexOAuth2User yandexUser) {
                yandexId = yandexUser.getYandexId();
            } else {
                yandexId = oauth2User.getName();
            }

            Optional<User> userOpt = userService.findByYandexId(yandexId);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "authenticated", true,
                                "yandexId", yandexId,
                                "message", "User not found in database"
                        ));
            }

            User user = userOpt.get();
            UserDto userDto = userMapper.toDto(user);

            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "user", userDto,
                    "accessGranted", "approved".equals(userDto.getRegistrationStatus())
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "authenticated", false,
                        "message", "Unknown authentication type"
                ));
    }

    @GetMapping("/status")
    @Operation(summary = "Check authentication status",
            description = "Returns whether the user is authenticated and their approval status")
    public ResponseEntity<Map<String, Object>> getStatus(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", false,
                    "loginUrl", "/oauth2/authorization/yandex"
            ));
        }

        String yandexId;
        if (principal instanceof YandexOAuth2User yandexUser) {
            yandexId = yandexUser.getYandexId();
        } else {
            yandexId = principal.getName();
        }

        Optional<User> userOpt = userService.findByYandexId(yandexId);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "registered", false,
                    "approved", false
            ));
        }

        User user = userOpt.get();
        String status = user.getRegistrationRequest() != null 
                ? user.getRegistrationRequest().getStatus() 
                : "unknown";
        
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "registered", true,
                "approved", "approved".equals(status),
                "registrationStatus", status,
                "userId", user.getId(),
                "name", user.getName()
        ));
    }

    @GetMapping("/login-info")
    @Operation(summary = "Get login information",
            description = "Returns OAuth2 login URL for Yandex ID")
    public ResponseEntity<Map<String, String>> getLoginInfo() {
        return ResponseEntity.ok(Map.of(
                "provider", "yandex",
                "loginUrl", "/oauth2/authorization/yandex",
                "description", "Redirect user to loginUrl to initiate Yandex ID authentication"
        ));
    }
}
