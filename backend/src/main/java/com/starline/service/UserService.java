package com.starline.service;

import com.starline.dto.request.LoginRequest;
import com.starline.dto.request.SignupRequest;
import com.starline.dto.request.UpdateProfileRequest;
import com.starline.dto.request.ChangePasswordRequest;
import com.starline.dto.response.AuthResponse;
import com.starline.dto.response.UserProfileResponse;
import com.starline.entity.User;
import com.starline.repository.UserRepository;
import com.starline.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Validate userId format
        if (!isValidUserId(request.getUserId())) {
            throw new IllegalArgumentException("ユーザーIDは3～20文字の英小文字、数字、アンダースコアのみ許可");
        }

        // Check if userId already exists
        if (userRepository.existsByUserId(request.getUserId().toLowerCase())) {
            throw new IllegalArgumentException("このユーザーIDは既に登録されています");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("このメールアドレスは既に登録されています");
        }

        // Validate password
        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("パスワードは8文字以上である必要があります");
        }

        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("パスワードが一致しません");
        }

        // Create user
        User user = new User(
                request.getUserId().toLowerCase(),
                request.getDisplayName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(user.getId(), user.getUserId());
        return new AuthResponse(token, user.getId(), user.getUserId(), user.getDisplayName());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("メールアドレスまたはパスワードが正しくありません"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("メールアドレスまたはパスワードが正しくありません");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUserId());
        return new AuthResponse(token, user.getId(), user.getUserId(), user.getDisplayName());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません"));
    }

    public User getUserByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません"));
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserById(userId);

        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("このメールアドレスは既に登録されています");
        }

        user.setDisplayName(request.getDisplayName());
        user.setEmail(request.getEmail());
        user.setBio(request.getBio());
        user.setIconUrl(request.getIconUrl());
        userRepository.save(user);

        return new UserProfileResponse(user.getId(), user.getUserId(), user.getDisplayName(), user.getEmail(), user.getBio(), user.getIconUrl());
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUserById(userId);

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("現在のパスワードが正しくありません");
        }

        // Validate new password
        if (request.getNewPassword().length() < 8) {
            throw new IllegalArgumentException("パスワードは8文字以上である必要があります");
        }

        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new IllegalArgumentException("新しいパスワードが一致しません");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public String uploadProfileIcon(Long userId, MultipartFile file) throws IOException {
        User user = getUserById(userId);

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("ファイルが選択されていません");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("画像ファイルのみアップロード可能です");
        }

        // Check file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("ファイルサイズは10MB以下にしてください");
        }

        // Create uploads directory if it doesn't exist
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = "icon_" + userId + "_" + UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Update user icon URL
        String iconUrl = "/uploads/" + filename;
        user.setIconUrl(iconUrl);
        userRepository.save(user);

        return iconUrl;
    }

    @Transactional
    public UserProfileResponse getProfile(Long userId) {
        User user = getUserById(userId);
        return new UserProfileResponse(user.getId(), user.getUserId(), user.getDisplayName(), user.getEmail(), user.getBio(), user.getIconUrl());
    }

    private boolean isValidUserId(String userId) {
        return userId != null && userId.matches("^[a-z0-9_]{3,20}$");
    }
}
