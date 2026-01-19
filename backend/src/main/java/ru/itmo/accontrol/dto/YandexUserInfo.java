package ru.itmo.accontrol.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class YandexUserInfo {
    
    private String id;
    
    private String login;
    
    @JsonProperty("client_id")
    private String clientId;
    
    @JsonProperty("display_name")
    private String displayName;
    
    @JsonProperty("real_name")
    private String realName;
    
    @JsonProperty("first_name")
    private String firstName;
    
    @JsonProperty("last_name")
    private String lastName;
    
    private String sex;
    
    @JsonProperty("default_email")
    private String defaultEmail;
    
    private List<String> emails;
    
    private String psuid;
    
    /**
     * Returns the best available name for the user.
     */
    public String getBestName() {
        if (realName != null && !realName.isBlank()) {
            return realName;
        }
        if (displayName != null && !displayName.isBlank()) {
            return displayName;
        }
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return login;
    }
    
    /**
     * Returns the best available email.
     */
    public String getBestEmail() {
        if (defaultEmail != null && !defaultEmail.isBlank()) {
            return defaultEmail;
        }
        if (emails != null && !emails.isEmpty()) {
            return emails.get(0);
        }
        return login + "@yandex.ru";
    }
}
