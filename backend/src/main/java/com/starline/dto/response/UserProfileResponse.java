package com.starline.dto.response;

public class UserProfileResponse {

    private Long userId;
    private String username;
    private String displayName;
    private String email;
    private String bio;
    private String iconUrl;

    public UserProfileResponse() {}

    public UserProfileResponse(Long userId, String username, String displayName, String email, String bio, String iconUrl) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.bio = bio;
        this.iconUrl = iconUrl;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }
}
