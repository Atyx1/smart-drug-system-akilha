package com.akilha.configuration.security;


import com.akilha.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UUIDGeneratorAndShortener {

    private final UserRepository userRepository;
    private  List<String> allCodes = new ArrayList<>();

    private  void loadAllCodes() {


        List<String> activationCodes = userRepository.findAllActivationCodes();
        List<String> resetCodes = userRepository.findAllPasswordResetCodes();

        if (activationCodes != null) {
            allCodes.addAll(activationCodes);
        }

        if (resetCodes != null) {
            allCodes.addAll(resetCodes);
        }
    }

    private  boolean isCodeUnique(String code) {
        return !allCodes.contains(code);
    }

    public   String generateUniqueShortenedUUID(UUID uuid) {
        loadAllCodes();
        while (true) {
            String shortenedUUID = shortenUUID(uuid);

            if (isCodeUnique(shortenedUUID)) {
                allCodes.add(shortenedUUID);  // Yeni kodu listeye ekleyin
                return shortenedUUID;
            } else {
                uuid = UUID.randomUUID(); // Benzersiz bir UUID oluştur
            }
        }
    }

    private static String shortenUUID(UUID uuid) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(uuid.toString().getBytes(StandardCharsets.UTF_8));
            String base64Encoded = Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
            return base64Encoded.substring(0, 9);  // 6 karakterlik kısaltılmış UUID
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algoritması bulunamadı", e);
        }
    }
}
