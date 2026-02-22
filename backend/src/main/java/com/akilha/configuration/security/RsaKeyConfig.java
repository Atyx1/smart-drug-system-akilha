package com.akilha.configuration.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Configuration
public class RsaKeyConfig {

    @Bean
    public KeyPair keyPair() throws Exception {
        byte[] privateKeyBytes = Files.readAllBytes(Paths.get("private_key_pkcs8.pem"));
        byte[] publicKeyBytes = Files.readAllBytes(Paths.get("public.pem"));

        String privateKeyPem = new String(privateKeyBytes)
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
        String publicKeyPem = new String(publicKeyBytes)
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        PrivateKey privateKey = keyFactory.generatePrivate(new  PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyPem)));
        PublicKey publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyPem)));

        return new KeyPair(publicKey, privateKey);
    }
}