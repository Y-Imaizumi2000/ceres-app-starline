package com.starline.dto.response;

public class AuthResponse {

    private String token;
    private Long userId;
    private String username;
    private String displayName;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String username, String displayName) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
