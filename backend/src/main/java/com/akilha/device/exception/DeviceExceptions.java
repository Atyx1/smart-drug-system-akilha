package com.akilha.device.exception;



import com.akilha.message.Messages;
import org.springframework.context.i18n.LocaleContextHolder;


public class DeviceExceptions {

    public static class DeviceNotFoundException extends RuntimeException {
        public DeviceNotFoundException() {
            super(Messages.getMessageForLocale("device.error.not.found", LocaleContextHolder.getLocale()));
        }
    }

    public static class DeviceAlreadyExistsException extends RuntimeException {
        public DeviceAlreadyExistsException(String name) {
            super(Messages.getMessageForLocale("device.error.already.exists", LocaleContextHolder.getLocale(), name));
        }
    }

    public static class DeviceAlreadyHasOwnerException extends RuntimeException {
        public DeviceAlreadyHasOwnerException(String name) {
            super(Messages.getMessageForLocale("device.error.has.owner", LocaleContextHolder.getLocale(), name));
        }
    }

    public static class InvalidDeviceCredentialsException extends RuntimeException {
        public InvalidDeviceCredentialsException() {
            super(Messages.getMessageForLocale("device.error.credentials.invalid", LocaleContextHolder.getLocale()));
        }
    }

    public static class DeviceAccessDeniedException extends RuntimeException {
        public DeviceAccessDeniedException() {
            super(Messages.getMessageForLocale("device.error.access.denied", LocaleContextHolder.getLocale()));
        }
    }

    public static class CannotBlockOwnerException extends RuntimeException {
        public CannotBlockOwnerException() {
            super(Messages.getMessageForLocale("device.error.cannot.block.owner", LocaleContextHolder.getLocale()));
        }
    }


}