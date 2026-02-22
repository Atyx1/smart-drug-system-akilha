package com.akilha.configuration.properties;

import com.akilha.configuration.security.UUIDGeneratorAndShortener;

import com.akilha.user.entity.Role;
import com.akilha.user.entity.User;
import com.akilha.user.entity.UserStatus;
import com.akilha.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FakeDataGenerator {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private  final UUIDGeneratorAndShortener uuidGeneratorAndShortener;

    @PostConstruct
    public void generateData() {

        if (userRepository.count() == 0) {

            String encodedPassword = passwordEncoder.encode("Atylmaz32.");



            User managerUser = new User();
            managerUser.setUsername("Atylmaz");
            managerUser.setFullName("Ahmet Tayyib Yılmaz");
            managerUser.setEmail("atylmaz@manager.com");
            managerUser.setStatus(UserStatus.ACTIVE);
            managerUser.setPassword(encodedPassword);
            managerUser.setPasswordResetCode(uuidGeneratorAndShortener.generateUniqueShortenedUUID(UUID.randomUUID()));
            managerUser.setRole(Role.MANAGER);
            managerUser.setActive(true);

            userRepository.save(managerUser);
            System.out.println("✅ Manager kullanıcısı başarıyla oluşturuldu!");
        }


    }
}