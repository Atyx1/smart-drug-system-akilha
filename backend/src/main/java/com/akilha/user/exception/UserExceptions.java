package com.akilha.user.exception;


import com.akilha.message.Messages;
import org.springframework.context.i18n.LocaleContextHolder;


public class UserExceptions {

    public static class EmailNotFoundException extends RuntimeException {
        public EmailNotFoundException() {
            super(Messages.getMessageForLocale("user.error.email.notFound", LocaleContextHolder.getLocale()));
        }
    }

    public static class AccessDeniedExceptionForUserException extends RuntimeException {
        public AccessDeniedExceptionForUserException() {
            super(Messages.getMessageForLocale("user.error.access.denied", LocaleContextHolder.getLocale()));
        }
    }


    public static class UserHaveTokenException extends RuntimeException {
        public UserHaveTokenException() {
            super(Messages.getMessageForLocale("user.error.token.exists", LocaleContextHolder.getLocale()));
        }
    }


    public static class ActivationNotificationException extends RuntimeException {
        public ActivationNotificationException() {
            super(Messages.getMessageForLocale("user.error.activation.notification", LocaleContextHolder.getLocale()));
        }
    }

    public static class AlreadyLoggedException extends RuntimeException {
        public AlreadyLoggedException() {
            super(Messages.getMessageForLocale("user.error.already.logged", LocaleContextHolder.getLocale()));
        }
    }

    public static class AuthenticationException extends RuntimeException {
        public AuthenticationException() {
            super(Messages.getMessageForLocale("user.error.authentication", LocaleContextHolder.getLocale()));
        }
    }

    public static class AuthorizationException extends RuntimeException {
        public AuthorizationException() {
            super(Messages.getMessageForLocale("user.error.authorization", LocaleContextHolder.getLocale()));
        }
    }

    public static class ChangePasswordIsNotWorkingException extends RuntimeException {
        public ChangePasswordIsNotWorkingException() {
            super(Messages.getMessageForLocale("user.error.password.change", LocaleContextHolder.getLocale()));
        }
    }

    public static class InvalidEmailException extends RuntimeException {
        public InvalidEmailException() {
            super(Messages.getMessageForLocale("user.error.email.invalid", LocaleContextHolder.getLocale()));
        }
    }

    public static class InvalidPasswordException extends RuntimeException {
        public InvalidPasswordException() {
            super(Messages.getMessageForLocale("user.error.password.invalid", LocaleContextHolder.getLocale()));
        }
    }

    public static class InvalidResetCodeException extends RuntimeException {
        public InvalidResetCodeException() {
            super(Messages.getMessageForLocale("user.error.resetcode.invalid", LocaleContextHolder.getLocale()));
        }
    }

    public static class InvalidTokenException extends RuntimeException {
        public InvalidTokenException() {
            super(Messages.getMessageForLocale("user.error.token.invalid", LocaleContextHolder.getLocale()));
        }
    }

    public static class NotActiveUserException extends RuntimeException {
        public NotActiveUserException() {
            super(Messages.getMessageForLocale("user.error.not.active", LocaleContextHolder.getLocale()));
        }
    }



    public static class NotUniqueEmailException extends RuntimeException {
        public NotUniqueEmailException() {
            super(Messages.getMessageForLocale("user.error.email.duplicate", LocaleContextHolder.getLocale()));
        }
    }

    public static class NotUniqueUsernameException extends RuntimeException {
        public NotUniqueUsernameException() {
            super(Messages.getMessageForLocale("user.error.username.duplicate", LocaleContextHolder.getLocale()));
        }
    }



    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException() {
            super(Messages.getMessageForLocale("user.error.not.found", LocaleContextHolder.getLocale()));
        }

        public UserNotFoundException(String userId) {
            super(Messages.getMessageForLocale("user.error.not.found.with.id", LocaleContextHolder.getLocale(), userId));
        }
    }

public static class StoreNotFoundException extends RuntimeException {
    public StoreNotFoundException(String s) {
        super(Messages.getMessageForLocale("error.store.not.found", LocaleContextHolder.getLocale()));
    }
}

    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException() {
            super(Messages.getMessageForLocale("user.error.unauthorized", LocaleContextHolder.getLocale()));
        }
    }

    public static class ForbiddenException extends RuntimeException {
        public ForbiddenException() {
            super(Messages.getMessageForLocale("user.error.forbidden", LocaleContextHolder.getLocale()));
        }
    }

    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String resource, String field, Object value) {
            super(Messages.getMessageForLocale("error.resource.not.found",
                    LocaleContextHolder.getLocale(), resource, field, value));
        }
    }

    public static class InvalidRequestException extends RuntimeException {
        public InvalidRequestException() {
            super(Messages.getMessageForLocale("error.invalid.request", LocaleContextHolder.getLocale()));
        }
    }

    public static class FileStorageException extends RuntimeException {
        public FileStorageException() {
            super(Messages.getMessageForLocale("error.file.storage", LocaleContextHolder.getLocale()));
        }
    }

    public static class InvalidOperationException extends RuntimeException {
        public InvalidOperationException() {
            super(Messages.getMessageForLocale("error.invalid.operation", LocaleContextHolder.getLocale()));
        }
    }
    public static class TokenHeaderMissingException extends RuntimeException {
        public TokenHeaderMissingException() {
            super(Messages.getMessageForLocale("user.error.token.header.missing", LocaleContextHolder.getLocale()));
        }
    }

    public static class InvalidTokenFormatException extends RuntimeException {
        public InvalidTokenFormatException() {
            super(Messages.getMessageForLocale("user.error.token.format.invalid", LocaleContextHolder.getLocale()));
        }
    }

    public static class BlacklistedTokenException extends RuntimeException {
        public BlacklistedTokenException() {
            super(Messages.getMessageForLocale("user.error.token.blacklisted", LocaleContextHolder.getLocale()));
        }
    }

    public static class TokenNotFoundException extends RuntimeException {
        public TokenNotFoundException() {
            super(Messages.getMessageForLocale("user.error.token.not.found", LocaleContextHolder.getLocale()));
        }
    }

    public static class TokenVerificationException extends RuntimeException {
        public TokenVerificationException() {
            super(Messages.getMessageForLocale("user.error.token.verification", LocaleContextHolder.getLocale()));
        }
    }

    public static class TokenDeletionException extends RuntimeException {
        public TokenDeletionException() {
            super(Messages.getMessageForLocale("user.error.token.deletion", LocaleContextHolder.getLocale()));
        }
    }

    public static class PasswordResetException extends Throwable {
        public PasswordResetException() {
            super(Messages.getMessageForLocale("user.error.password.change", LocaleContextHolder.getLocale()));
        }
    }
}