package com.starline.service;

import com.starline.dto.request.LoginRequest;
import com.starline.dto.request.SignupRequest;
import com.starline.dto.response.AuthResponse;
import com.starline.entity.User;
import com.starline.repository.UserRepository;
import com.starline.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private boolean isValidUserId(String userId) {
        return userId != null && userId.matches("^[a-z0-9_]{3,20}$");
    }
}
