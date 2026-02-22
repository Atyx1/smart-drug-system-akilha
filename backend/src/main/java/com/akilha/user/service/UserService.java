package com.akilha.user.service;

import com.akilha.approve.PendingApprovalService;
import com.akilha.configuration.security.CurrentUser;
import com.akilha.configuration.security.UUIDGeneratorAndShortener;
import com.akilha.email.EmailService;

import com.akilha.token.TokenService;
import com.akilha.logging.service.ActivityLogService;

import com.akilha.user.repository.UserRepository;
import com.akilha.user.entity.UserStatus;
import com.akilha.user.entity.Role;
import com.akilha.user.exception.UserExceptions;
import com.akilha.user.exception.UserExceptions.StoreNotFoundException;
import com.akilha.user.dto.UserDto;
import com.akilha.user.entity.User;
import jakarta.transaction.Transactional;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Validated
public class UserService {

    private final UserRepository userRepository;

    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    private final UUIDGeneratorAndShortener UUIDGeneratorAndShortener;

    private static final Logger log = LoggerFactory.getLogger(UserService.class);


    /**
     *  Şu an giriş yapmış olan kullanıcıyı getirir.
     */
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CurrentUser) {
            Long userId = ((CurrentUser) principal).getId();
            return userRepository.findById(userId)
                    .orElseThrow(() -> new UserExceptions.UserNotFoundException(userId.toString()));
        }
        throw new RuntimeException("Principal is not of type CurrentUser");
    }




    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }


    @Transactional(rollbackOn = MailException.class)
    public UserDto registerUser(@Valid UserDto.UserCreateDTO createDTO) throws MessagingException, StoreNotFoundException {

        User user = new User();
        user.setUsername(createDTO.getUsername());
        user.setFullName(createDTO.getFullName());
        user.setEmail(createDTO.getEmail());
        user.setPassword(passwordEncoder.encode(createDTO.getPassword()));
        user.setActivationCode(generateActivationCode());
        user.setPasswordResetCode(generateActivationCode());
        user.setRole(Role.USER);
        user.setStatus(UserStatus.PENDING);

        User savedUser = userRepository.save(user);



        emailService.sendActivationEmail(user.getEmail(), user.getFullName(), user.getActivationCode());

        return new UserDto(savedUser);
    }




    /**
     * Kullanıcıyı günceller (Şu an giriş yapmış olan kullanıcı).
     */
    @Transactional
    public UserDto updateUser(@Valid UserDto.UserUpdateDTO updateDTO) throws StoreNotFoundException {
        User user = getCurrentUser();
        if(user.getId()!=updateDTO.getId()) throw new UserExceptions.AccessDeniedExceptionForUserException();
        
        String oldFullName = user.getFullName();

        user.setFullName(updateDTO.getFullName());

        User updatedUser = userRepository.save(user);

        // Kullanıcı güncelleme için log oluştur
        String formattedDate = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
        String logDescription = String.format(
                "%s kullanıcısı %s tarihinde bilgilerini güncelledi",
                user.getUsername(),
                formattedDate
        );
        
        Map<String, Object> details = new HashMap<>();
        details.put("oldFullName", oldFullName);
        details.put("newFullName", user.getFullName());



        return new UserDto(updatedUser);
    }




    /**
     * Sistemdeki tüm kullanıcıları getirir (current user hariç)
     * @return Kullanıcı listesi (DTO formatında)
     */
    @Transactional
    public List<UserDto> getAllUsersExceptCurrent() {
        User currentUser = getCurrentUser();
        List<User> allUsers = userRepository.findByDeletedFalse(); // Sadece silinmemiş kullanıcılar

        return allUsers.stream()
                .filter(user -> user.getId() != currentUser.getId())
                .map(UserDto::new)
                .collect(Collectors.toList());
    }



    /**
     * Kullanıcı kendini sistemden siler.
     */
    @Transactional
    public void deleteUser(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserExceptions.UserNotFoundException(String.valueOf(id)));


        String username = user.getUsername();
        
        User currentUser = getCurrentUser();
        
        userRepository.delete(user);
        log.info("User deleted: {}", id);
        
        // Kullanıcı silme için log oluştur
        String formattedDate = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
        String logDescription = String.format(
                "%s kullanıcısı %s tarihinde %s kullanıcısını sistemden tamamen sildi",
                currentUser.getUsername(),
                formattedDate,
                username
        );
        

    }



    /**
     * Soft delete işlemi - Kullanıcıyı pasif hale getirir
     */
    @Transactional
    public void softDeleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserExceptions.UserNotFoundException(email));
        

        String username = user.getUsername();
        Long userId = user.getId();
        
        User currentUser = getCurrentUser();

        if (user.isDeleted()) {
            throw new RuntimeException("User with email " + email + " is already inactive");
        }
        user.setDeleted(true);
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
        log.info("User soft deleted: {}", email);
        
        // Kullanıcı soft-delete için log oluştur
        String formattedDate = LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
        String logDescription = String.format(
                "%s kullanıcısı %s tarihinde %s kullanıcısını pasif durumuna aldı",
                currentUser.getUsername(),
                formattedDate,
                username
        );
        

    }




    @Transactional
    public void resetPasswordInsideApplication(UserDto.UserPasswordUpdateDTOInside userPasswordUpdate) {
        User user = userRepository.findById(getCurrentUser().getId()).orElseThrow(UserExceptions.UserNotFoundException::new);
        
        // Eski şifre doğru değilse exception fırlatılacak
        if (passwordEncoder.matches(userPasswordUpdate.getOldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(userPasswordUpdate.getNewPassword()));
            userRepository.save(user);

        } else {
            throw new UserExceptions.InvalidPasswordException();
        }
    }

    @Transactional
    public void resetPasswordOutsideApplication(String resetCode, UserDto.UserPasswordUpdateDTOOutside userNewPassword) {
        Optional<User> userOpt = userRepository.findByPasswordResetCode(resetCode);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(userNewPassword.getNewPassword()));
            user.setPasswordResetCode(null);
            user.setPasswordResetCode(UUIDGeneratorAndShortener.generateUniqueShortenedUUID(UUID.randomUUID()));
            userRepository.save(user);
            

        } else {
            throw new UserExceptions.InvalidResetCodeException();
        }
    }

    public void passwordChangeActivation(String email) {
        Optional<User> inDB = userRepository.findByEmail(email);

        if (inDB.isPresent()) {
            // Eğer kullanıcı daha önce bir token'a sahipse, exception fırlat
            if (tokenService.isUserHaveToken(inDB.orElse(null))) {
                throw new UserExceptions.UserHaveTokenException();
            }

            try {
                // Şifre sıfırlama kodunu oluştur
                String resetCode = UUIDGeneratorAndShortener.generateUniqueShortenedUUID(UUID.randomUUID());
                inDB.get().setPasswordResetCode(resetCode);
                userRepository.save(inDB.get());

                // Şifre sıfırlama e-postasını gönder
                emailService.sendPasswordChangeEmail(email, inDB.get().getFullName(), resetCode);

                // 1 dakika sonra şifre sıfırlama kodunu geçersiz yap
                CompletableFuture.runAsync(() -> {
                    try {
                        TimeUnit.MINUTES.sleep(10);  // 1 dakika bekle
                        inDB.get().setPasswordResetCode(UUIDGeneratorAndShortener.generateUniqueShortenedUUID(UUID.randomUUID()));  // Şifre sıfırlama kodunu geçersiz yap
                        userRepository.save(inDB.get());
                        System.out.println("Password reset code has been invalidated after 1 minute for user: " + inDB.get().getEmail());
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException(e);
                    }
                });

            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        } else {
            throw new UserExceptions.EmailNotFoundException();
        }
    }

    @Transactional
    public void activateUser(String token) {
        Optional<User> inDB = userRepository.findByActivationCode(token);
        if (inDB.isEmpty() || inDB.get().isActive()) {  // Add check to avoid reactivation
            throw new UserExceptions.UserNotFoundException();  // Already activated or not found
        }

        User user = inDB.get();
        user.setActive(true);
        user.setActivationCode(null); // Nullify activation code after activation
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        

    }


    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }



    /**
     *  Yardımcı Metodlar
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    private String generateActivationCode() {
        return UUIDGeneratorAndShortener.generateUniqueShortenedUUID(UUID.randomUUID());
    }



    /**
     * Şifre sıfırlama token'ının geçerliliğini kontrol eder.
     * @param token Kontrol edilecek token
     * @throws UserExceptions.InvalidResetCodeException Token geçersizse
     */
    public void validatePasswordResetToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new UserExceptions.InvalidResetCodeException();
        }

        Optional<User> user = userRepository.findByPasswordResetCode(token);

        if (user.isEmpty()) {
            log.error("Invalid password reset token: {}", token);
            throw new UserExceptions.InvalidResetCodeException();
        }

        // Token'ın geçerli olduğunu doğruladık
        log.info("Password reset token validated successfully for user: {}", user.get().getEmail());
    }


    public UserDto.UserStatusAndRoleResponseDTO getUserStatusAndRoleById(Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new UserExceptions.UserNotFoundException(userId.toString()));
        UserDto.UserStatusAndRoleResponseDTO userStatusAndRoleResponseDTO = new UserDto.UserStatusAndRoleResponseDTO();
        userStatusAndRoleResponseDTO.setStatus(user.getStatus());
        userStatusAndRoleResponseDTO.setRole(user.getRole());

        return userStatusAndRoleResponseDTO;


    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UserExceptions.UserNotFoundException(userId.toString()));
    }

    public User findById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UserExceptions.UserNotFoundException(userId.toString()));
    }
}