package com.starline.dto.request;

public class UpdateProfileRequest {

    private String displayName;
    private String email;
    private String bio;
    private String iconUrl;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String displayName, String email, String bio, String iconUrl) {
        this.displayName = displayName;
        this.email = email;
        this.bio = bio;
        this.iconUrl = iconUrl;
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
