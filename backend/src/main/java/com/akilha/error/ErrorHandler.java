package com.akilha.error;

import com.akilha.approve.ApprovalExceptions;
import com.akilha.device.exception.DeviceExceptions;
import com.akilha.message.ApiResponse;
import com.akilha.message.Messages;
import com.akilha.message.ResponseBuilder;
import com.akilha.tracker.exception.TrackerExceptions;
import com.akilha.user.exception.UserExceptions;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ErrorHandler {
    private static final Logger log = LoggerFactory.getLogger(ErrorHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(MethodArgumentNotValidException exception, HttpServletRequest request) {
        Map<String, String> validationErrors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            validationErrors.put(field, message);
        });
        return createErrorResponse(HttpStatus.BAD_REQUEST, Messages.getMessageForLocale("validation.error", LocaleContextHolder.getLocale()), request.getRequestURI(), validationErrors);
    }

    @ExceptionHandler(UserExceptions.AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(UserExceptions.AuthenticationException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        String errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
        return ResponseBuilder.error(HttpStatus.CONFLICT, errorMessage);
    }


    @ExceptionHandler(UserExceptions.InvalidTokenException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidTokenException(UserExceptions.InvalidTokenException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.AccessDeniedExceptionForUserException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedExceptionForUserException(UserExceptions.AccessDeniedExceptionForUserException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.FORBIDDEN, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.NotActiveUserException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotActiveUserException(UserExceptions.NotActiveUserException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.FORBIDDEN, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.AuthorizationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthorizationException(UserExceptions.AuthorizationException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.FORBIDDEN, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserNotFoundException(UserExceptions.UserNotFoundException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.EmailNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEmailNotFoundException(UserExceptions.EmailNotFoundException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.StoreNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleStoreNotFoundException(UserExceptions.StoreNotFoundException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.InvalidPasswordException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidPasswordException(UserExceptions.InvalidPasswordException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.InvalidResetCodeException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidResetCodeException(UserExceptions.InvalidResetCodeException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.InvalidEmailException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidEmailException(UserExceptions.InvalidEmailException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.NotUniqueEmailException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotUniqueEmailException(UserExceptions.NotUniqueEmailException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.NotUniqueUsernameException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotUniqueUsernameException(UserExceptions.NotUniqueUsernameException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }



    @ExceptionHandler(UserExceptions.UserHaveTokenException.class)
    public ResponseEntity<ApiResponse<Void>> handleUserHaveTokenException(UserExceptions.UserHaveTokenException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.AlreadyLoggedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAlreadyLoggedException(UserExceptions.AlreadyLoggedException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(UserExceptions.ChangePasswordIsNotWorkingException.class)
    public ResponseEntity<ApiResponse<Void>> handleChangePasswordIsNotWorkingException(UserExceptions.ChangePasswordIsNotWorkingException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }



    @ExceptionHandler(UserExceptions.ActivationNotificationException.class)
    public ResponseEntity<ApiResponse<Void>> handleActivationNotificationException(UserExceptions.ActivationNotificationException exception, HttpServletRequest request) {
        return createErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage(), request.getRequestURI());
    }



    private <T> ResponseEntity<ApiResponse<T>> createErrorResponse(HttpStatus status, String message, String path) {
        return createErrorResponse(status, message, path, null);
    }

    @ExceptionHandler(UserExceptions.UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorizedException(
            UserExceptions.UnauthorizedException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.UNAUTHORIZED,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.ForbiddenException.class)
    public ResponseEntity<ApiResponse<Void>> handleForbiddenException(
            UserExceptions.ForbiddenException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.FORBIDDEN,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(
            UserExceptions.ResourceNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.InvalidRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidRequestException(
            UserExceptions.InvalidRequestException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.FileStorageException.class)
    public ResponseEntity<ApiResponse<Void>> handleFileStorageException(
            UserExceptions.FileStorageException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.InvalidOperationException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidOperationException(
            UserExceptions.InvalidOperationException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request.getRequestURI()
        );
    }



    @ExceptionHandler(UserExceptions.TokenHeaderMissingException.class)
    public ResponseEntity<ApiResponse<Void>> handleTokenHeaderMissingException(
            UserExceptions.TokenHeaderMissingException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.UNAUTHORIZED,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.InvalidTokenFormatException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidTokenFormatException(
            UserExceptions.InvalidTokenFormatException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.UNAUTHORIZED,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.BlacklistedTokenException.class)
    public ResponseEntity<ApiResponse<Void>> handleBlacklistedTokenException(
            UserExceptions.BlacklistedTokenException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.UNAUTHORIZED,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.TokenNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleTokenNotFoundException(
            UserExceptions.TokenNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.UNAUTHORIZED,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.TokenVerificationException.class)
    public ResponseEntity<ApiResponse<Void>> handleTokenVerificationException(
            UserExceptions.TokenVerificationException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.UNAUTHORIZED,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(UserExceptions.TokenDeletionException.class)
    public ResponseEntity<ApiResponse<Void>> handleTokenDeletionException(
            UserExceptions.TokenDeletionException exception,
            HttpServletRequest request) {
        return createErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(ApprovalExceptions.ApprovalNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleApprovalNotFoundException(
            ApprovalExceptions.ApprovalNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ApprovalExceptions.NotViewerRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotViewerRequestException(
            ApprovalExceptions.NotViewerRequestException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ApprovalExceptions.ViewerApprovalAccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleViewerApprovalAccessDeniedException(
            ApprovalExceptions.ViewerApprovalAccessDeniedException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.FORBIDDEN, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(DeviceExceptions.DeviceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleDeviceNotFoundException(
            DeviceExceptions.DeviceNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(DeviceExceptions.DeviceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Void>> handleDeviceAlreadyExistsException(
            DeviceExceptions.DeviceAlreadyExistsException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.CONFLICT, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(DeviceExceptions.DeviceAlreadyHasOwnerException.class)
    public ResponseEntity<ApiResponse<Void>> handleDeviceAlreadyHasOwnerException(
            DeviceExceptions.DeviceAlreadyHasOwnerException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(DeviceExceptions.InvalidDeviceCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidDeviceCredentialsException(
            DeviceExceptions.InvalidDeviceCredentialsException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(DeviceExceptions.DeviceAccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleDeviceAccessDeniedException(
            DeviceExceptions.DeviceAccessDeniedException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.FORBIDDEN, exception.getMessage(), request.getRequestURI());
    }



    @ExceptionHandler(TrackerExceptions.CompartmentNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleCompartmentNotFoundException(
            TrackerExceptions.CompartmentNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.CompartmentAccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleCompartmentAccessDeniedException(
            TrackerExceptions.CompartmentAccessDeniedException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.FORBIDDEN, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.PendingPillsExistException.class)
    public ResponseEntity<ApiResponse<Void>> handlePendingPillsExistException(
            TrackerExceptions.PendingPillsExistException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.DispensedWaitingPillsExistException.class)
    public ResponseEntity<ApiResponse<Void>> handleDispensedWaitingPillsExistException(
            TrackerExceptions.DispensedWaitingPillsExistException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.SessionUserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleSessionUserNotFoundException(
            TrackerExceptions.SessionUserNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.PillInstanceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handlePillInstanceNotFoundException(
            TrackerExceptions.PillInstanceNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.InvalidCompartmentMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidCompartmentMismatchException(
            TrackerExceptions.InvalidCompartmentMismatchException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.InvalidPillDropStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleInvalidPillDropStateException(
            TrackerExceptions.InvalidPillDropStateException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.CompartmentByIdNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleCompartmentByIdNotFoundException(
            TrackerExceptions.CompartmentByIdNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.CompartmentStillHasDispenseWaitingPillsException.class)
    public ResponseEntity<ApiResponse<Void>> handleCompartmentStillHasDispenseWaitingPillsException(
            TrackerExceptions.CompartmentStillHasDispenseWaitingPillsException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.DeviceNotFoundByOwnerException.class)
    public ResponseEntity<ApiResponse<Void>> handleDeviceNotFoundByOwnerException(
            TrackerExceptions.DeviceNotFoundByOwnerException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(TrackerExceptions.CurrentSessionUserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleCurrentSessionUserNotFoundException(
            TrackerExceptions.CurrentSessionUserNotFoundException exception,
            HttpServletRequest request) {
        return createErrorResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), request.getRequestURI());
    }






    private <T> ResponseEntity<ApiResponse<T>> createErrorResponse(HttpStatus status, String message, String path, Map<String, String> validationErrors) {
        return ResponseEntity.status(status)
                .body(ApiResponse.<T>builder()
                        .status(status.value())
                        .message(message)
                        .path(path)
                        .validationErrors(validationErrors)
                        .timestamp(LocalDateTime.now())
                        .build());
    }
}
