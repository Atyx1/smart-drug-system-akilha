package com.akilha.user.dto;

import com.akilha.user.entity.Role;
import com.akilha.user.entity.UserStatus;
import com.akilha.user.entity.User;
import com.akilha.user.validation.UniqueEmail;
import com.akilha.user.validation.UniqueUsername;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDto {

    private Long id;
    private String username;
    private String fullName;
    private String email;
    private Role role;
    private UserStatus status;
    private boolean active;


    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.active = user.isActive();

    }

    @Data
    public static class UserCreateDTO {
        @NotBlank(message = "{user.error.username.required}")
        @UniqueUsername
        private String username;

        @NotBlank(message = "{user.error.fullName.required}")
        private String fullName;

        @NotBlank(message = "{user.error.email.required}")
        @Email(message = "{user.error.email.invalid}")
        private String email;

        @NotBlank(message = "{user.error.password.required}")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "{trend.error.validation.constraints.password}"
        )
        @UniqueEmail
        private String password;

    }

    @Data
    public static class UserUpdateDTO {

        private Long id;

        @NotBlank(message = "{user.error.fullName.required}")
        private String fullName;


    }

    @Data
    public static class UserPasswordUpdateDTOInside {
        @NotBlank(message = "{user.error.oldPassword.required}")
        private String oldPassword;

        @NotBlank(message = "{user.error.password.required}")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "{trend.error.validation.constraints.password}"
        )
        private String newPassword;
    }

    @Data
    public static class UserPasswordUpdateDTOOutside {

        @NotBlank(message = "{user.error.password.required}")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "{trend.error.validation.constraints.password}"
        )
        private String newPassword;
    }

    @Data
    public static class UserStatusAndRoleResponseDTO {
        @NotNull
        private UserStatus status;

        @NotNull
        private Role role;
    }






    @Data
    public static class AdminCreateDTO {
        @NotBlank(message = "{user.error.username.required}")
        @UniqueUsername
        private String username;

        @NotBlank(message = "{user.error.fullName.required}")
        private String fullName;

        @NotBlank(message = "{user.error.email.required}")
        @Email(message = "{user.error.email.invalid}")
        @UniqueEmail
        private String email;

        @NotBlank(message = "{user.error.password.required}")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "{trend.error.validation.constraints.password}"
        )
        private String password;
    }

    @Data
    public static class UserActivationDTO {
        @NotBlank(message = "{user.error.activationCode.required}")
        private String activationCode;
    }

    @Data
    public static class UserPasswordInsideDTO {
        @NotBlank(message = "{user.error.password.required}")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "{trend.error.validation.constraints.password}"
        )
        private String newPassword;

        @NotBlank(message = "{user.error.oldPassword.required}")
        private String oldPassword;
    }


}