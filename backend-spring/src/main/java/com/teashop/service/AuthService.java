package com.teashop.service;

import com.teashop.entity.User;
import com.teashop.repository.UserRepository;
import com.teashop.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public Map<String, Object> register(String phone, String password, String nickname) {
        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("该手机号已注册");
        }

        User user = new User();
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setNickname(nickname != null ? nickname : "茶友");
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getPhone(), user.getNickname());
        return Map.of("token", token, "user", toSafeUser(user));
    }

    public Map<String, Object> login(String phone, String password) {
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getPhone(), user.getNickname());
        return Map.of("token", token, "user", toSafeUser(user));
    }

    /**
     * 微信小程序一键登录
     * 开发环境下，直接用 code 模拟 openid
     * 生产环境需调用微信 jscode2session 接口获取真实 openid
     */
    public Map<String, Object> wxMiniLogin(String code, String nickname, String avatar) {
        // 开发环境：用 code 的 hash 模拟 openid，保证唯一性
        String openid = "mock_" + Integer.toHexString(code.hashCode());

        User user = userRepository.findByWxOpenId(openid).orElse(null);

        if (user == null) {
            // 新用户自动注册
            user = new User();
            user.setWxOpenId(openid);
            user.setPhone("wx_" + openid.substring(0, Math.min(12, openid.length())));
            user.setPassword(passwordEncoder.encode(openid));
            user.setNickname(nickname != null ? nickname : "微信茶友");
            user.setAvatar(avatar != null ? avatar : "");
            user.setPoints(100); // 新用户送100积分
            user = userRepository.save(user);
        } else if (nickname != null || avatar != null) {
            // 更新用户信息
            if (nickname != null) user.setNickname(nickname);
            if (avatar != null) user.setAvatar(avatar);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getPhone(), user.getNickname());
        return Map.of("token", token, "uid", user.getId(), "user", toSafeUser(user));
    }

    /**
     * 微信小程序注册（完善信息）
     */
    public Map<String, Object> wxMiniRegister(String code, String encryptedData, String iv, String referrer) {
        // 开发环境：用 code 的 hash 模拟 openid
        String openid = "mock_" + Integer.toHexString(code.hashCode());

        User user = userRepository.findByWxOpenId(openid).orElse(null);
        if (user == null) {
            // 新用户
            user = new User();
            user.setWxOpenId(openid);
            user.setPhone("wx_" + openid.substring(0, Math.min(12, openid.length())));
            user.setPassword(passwordEncoder.encode(openid));
            user.setNickname("微信茶友");
            user.setAvatar("");
            user.setPoints(100);
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getPhone(), user.getNickname());
        return Map.of("token", token, "uid", user.getId(), "user", toSafeUser(user));
    }

    public User getProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public User updateProfile(Long userId, String nickname, String avatar) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        if (nickname != null) user.setNickname(nickname);
        if (avatar != null) user.setAvatar(avatar);
        return userRepository.save(user);
    }

    private Map<String, Object> toSafeUser(User user) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", user.getId());
        m.put("phone", user.getPhone());
        m.put("nickname", user.getNickname());
        m.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");
        m.put("points", user.getPoints() != null ? user.getPoints() : 0);
        m.put("membership_level", user.getMembershipLevel() != null ? user.getMembershipLevel() : 1);
        m.put("created_at", user.getCreatedAt());
        return m;
    }
}
