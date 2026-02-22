package com.akilha.user.controller;

import com.akilha.configuration.properties.BackendProperties;
import com.akilha.configuration.security.SecurityUtil;
import com.akilha.email.StaticTemplates;
import com.akilha.message.ApiResponse;
import com.akilha.message.Messages;
import com.akilha.message.ResponseBuilder;

import com.akilha.user.dto.UserDto;
import com.akilha.user.exception.UserExceptions;
import com.akilha.user.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Kullanıcı işlemleri için REST Controller.
 *
 * Not: Validasyon mesajları DTO’larda mesaj kodları şeklinde belirlenmiştir.
 * Bu mesaj kodlarının karşılıkları, merkezi properties dosyalarında (örn. messages.properties, messages_tr.properties) tanımlıdır.
 */
@Controller
@RequestMapping("/v1/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final BackendProperties backendProperties;
    private final StaticTemplates staticTemplates;
    private final SecurityUtil     securityUtil;



    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsernameExists(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    /**
     * Kullanıcının rol ve durum bilgilerini getirir
     */
    @GetMapping("/{userId}/status-role")
    public ResponseEntity<ApiResponse<UserDto.UserStatusAndRoleResponseDTO>> getUserStatusAndRole(
            @PathVariable Long userId
    ) {
            UserDto.UserStatusAndRoleResponseDTO userInfo = userService.getUserStatusAndRoleById(userId);
        return ResponseBuilder.success(
                userInfo,
                Messages.getMessageForLocale("user.status.role", LocaleContextHolder.getLocale())
        );
    }



    /**
     * Sistemdeki tüm kullanıcıları getirir (current user hariç)
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")  // Sadece MANAGER rolü erişebilir
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        securityUtil.validateUserRole("MANAGER");
        List<UserDto> users = userService.getAllUsersExceptCurrent();
        return ResponseBuilder.success(
                users,
                Messages.getMessageForLocale("users.list.success", LocaleContextHolder.getLocale())
        );
    }






    /**
     * Yeni kullanıcı kaydı (kullanıcı, mağaza bilgisiyle kayıt olur; başlangıçta PENDING durumundadır).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody UserDto.UserCreateDTO createDTO) throws MessagingException, UserExceptions.StoreNotFoundException {
    userService.registerUser(createDTO);
        return ResponseBuilder.created(
                          null,
                Messages.getMessageForLocale("user.create.success", LocaleContextHolder.getLocale())
        );
    }




    /**
     * Oturum açmış kullanıcı kendi bilgilerini günceller.
     */
    @PutMapping
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@Valid @RequestBody UserDto.UserUpdateDTO updateDTO) throws UserExceptions.StoreNotFoundException {
                 userService.updateUser(updateDTO);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("user.update.success", LocaleContextHolder.getLocale())
        );
    }


    /**
     * Manager, belirli e-posta adresine sahip kullanıcıyı sistemden siler.
     */
    @DeleteMapping("/admin/{email}")
    public ResponseEntity<ApiResponse<Void>> deleteUserByManager(@PathVariable String email) {
        securityUtil.validateUserRole("MANAGER");
        userService.softDeleteUser(email);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("user.delete.success", LocaleContextHolder.getLocale())
        );
    }



    /**
     * Oturum açmış kullanıcı, kendi hesabını sistemden siler.
     */
    @DeleteMapping("/current")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentUser() {
        // UserService#getCurrentUser() ile oturum açmış kullanıcı çekilir
        userService.deleteUser(userService.getCurrentUser().getId());
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("user.delete.success", LocaleContextHolder.getLocale())
        );
    }



    /**
     * Uygulama içi şifre güncelleme işlemi (eski şifre doğrulaması ile).
     */
    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> resetPasswordInside(@Valid @RequestBody UserDto.UserPasswordUpdateDTOInside userPasswordUpdate) {
        userService.resetPasswordInsideApplication(userPasswordUpdate);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("user.password.update.success", LocaleContextHolder.getLocale())
        );
    }




    /**
     * Şifre değiştirme aktivasyonu için, kullanıcıya şifre sıfırlama e-postası gönderir.
     */
    @PostMapping("/password/change/activation")
    public ResponseEntity<ApiResponse<Void>> passwordChangeActivation(@RequestParam String email) {
        userService.passwordChangeActivation(email);
        return ResponseBuilder.success(
                null,
                Messages.getMessageForLocale("user.password.change.activation.success", LocaleContextHolder.getLocale())
        );
    }



    /**
 * Kullanıcı aktivasyonu: Kullanıcı, kendisine gönderilen aktivasyon token'ı ile aktif hale getirilir.
 */
    @GetMapping("/activate")
    public ResponseEntity<?> activateUser(@RequestParam String token) {
        try {
            userService.activateUser(token);
            String homeUrl = backendProperties.getClient().host();
            String successHtml = staticTemplates.getActivationSuccessTemplate()
                    .replace("${homeUrl}", homeUrl);

            return ResponseEntity
                    .ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(successHtml);

        } catch (Exception e) {
            String retryUrl = backendProperties.getClient().host();
            String errorHtml = staticTemplates.getActivationErrorTemplate()
                    .replace("${retryUrl}", retryUrl);

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_HTML)
                    .body(errorHtml);
        }
    }

    @GetMapping("/reset-password")
    public Object showPasswordResetForm(@RequestParam String token, Model model) {
        try {
            userService.validatePasswordResetToken(token);

            // Model'e değişkenleri ekle
            model.addAttribute("resetToken", token);
            model.addAttribute("homeUrl", backendProperties.getClient().host());

            // templates/password-reset.html'e yönlendir
            return "password-reset";

        } catch (Exception e) {
            log.error("Invalid password reset token: {}", token, e);
            String retryUrl = backendProperties.getClient().host() + "/forgot-password";
            String errorHtml = staticTemplates.getPasswordResetErrorTemplate()
                    .replace("${retryUrl}", retryUrl);

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_HTML)
                    .body(errorHtml);
        }
    }

    /**
     * Uygulama dışı şifre sıfırlama işlemi (reset kodu kullanılarak).
     */
    @PutMapping("/password/reset/{resetCode}")
    public ResponseEntity<?> resetPasswordOutside(
            @PathVariable String resetCode,
            @Valid @RequestBody UserDto.UserPasswordUpdateDTOOutside userNewPassword) {
        try {
            log.debug("Resetting password for reset code: {}", resetCode);
            userService.resetPasswordOutsideApplication(resetCode, userNewPassword);

            // Başarılı durumda sadece OK dön
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Password reset failed for code: {}", resetCode, e);
            // Hata durumunda BAD_REQUEST dön
            return ResponseEntity.badRequest().build();
        }
    }



    @GetMapping("/reset-password/success")
    public ResponseEntity<?> showPasswordResetSuccess() {
        String homeUrl = backendProperties.getClient().host();
        String successHtml = staticTemplates.getPasswordResetSuccessTemplate()
                .replace("${homeUrl}", homeUrl);

        return ResponseEntity
                .ok()
                .contentType(MediaType.TEXT_HTML)
                .body(successHtml);
    }

    @GetMapping("/reset-password/fail")
    public ResponseEntity<?> showPasswordResetFail() {
        String homeUrl = "/api/v1/users/home";
        String failHtml = staticTemplates.getPasswordResetFailTemplate()
                .replace("${homeUrl}", homeUrl);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.TEXT_HTML)
                .body(failHtml);
    }


    @RequestMapping("/**")
    public ResponseEntity<?> handleNotFound() {
        String homeUrl = "/api/v1/users/home";
        String notFoundHtml = staticTemplates.getNotFoundTemplate()
                .replace("${homeUrl}", homeUrl);

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.TEXT_HTML)
                .body(notFoundHtml);
    }

    @GetMapping("/home")
    public ResponseEntity<?> showHomePage() {
        return ResponseEntity
                .ok()
                .contentType(MediaType.TEXT_HTML)
                .body(staticTemplates.getHomePageTemplate());
    }

}
