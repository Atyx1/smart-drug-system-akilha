package com.akilha.tracker.exception;


import com.akilha.message.Messages;
import org.springframework.context.i18n.LocaleContextHolder;




public class TrackerExceptions {

    public static class CompartmentNotFoundException extends RuntimeException {
        public CompartmentNotFoundException(Long deviceId, int idx) {
            super(Messages.getMessageForLocale("tracker.error.compartment.not.found", LocaleContextHolder.getLocale(), deviceId, idx));
        }
    }

    public static class CompartmentAccessDeniedException extends RuntimeException {
        public CompartmentAccessDeniedException() {
            super(Messages.getMessageForLocale("tracker.error.compartment.access.denied", LocaleContextHolder.getLocale()));
        }
    }

    public static class PendingPillsExistException extends RuntimeException {
        public PendingPillsExistException() {
            super(Messages.getMessageForLocale("tracker.error.compartment.pending.pills", LocaleContextHolder.getLocale()));
        }
    }

    public static class DispensedWaitingPillsExistException extends RuntimeException {
        public DispensedWaitingPillsExistException() {
            super(Messages.getMessageForLocale("tracker.error.compartment.waiting.pills", LocaleContextHolder.getLocale()));
        }
    }

    public static class SessionUserNotFoundException extends RuntimeException {
        public SessionUserNotFoundException() {
            super(Messages.getMessageForLocale("tracker.error.session.user.not.found", LocaleContextHolder.getLocale()));
        }
    }

    public static class PillInstanceNotFoundException extends RuntimeException {
        public PillInstanceNotFoundException(Long id) {
            super(Messages.getMessageForLocale("tracker.error.pill.not.found", LocaleContextHolder.getLocale(), id));
        }
    }

    public static class InvalidCompartmentMismatchException extends RuntimeException {
        public InvalidCompartmentMismatchException() {
            super(Messages.getMessageForLocale("tracker.error.compartment.device.mismatch", LocaleContextHolder.getLocale()));
        }
    }

    public static class InvalidPillDropStateException extends RuntimeException {
        public InvalidPillDropStateException() {
            super(Messages.getMessageForLocale("tracker.error.pill.drop.invalid.state", LocaleContextHolder.getLocale()));
        }
    }

    public static class CompartmentByIdNotFoundException extends RuntimeException {
        public CompartmentByIdNotFoundException(Long id) {
            super(Messages.getMessageForLocale("tracker.error.compartment.by.id.not.found", LocaleContextHolder.getLocale(), id));
        }
    }

    public static class CompartmentStillHasDispenseWaitingPillsException extends RuntimeException {
        public CompartmentStillHasDispenseWaitingPillsException() {
            super(Messages.getMessageForLocale("tracker.error.compartment.waiting.pills", LocaleContextHolder.getLocale()));
        }
    }

    public static class DeviceNotFoundByOwnerException extends RuntimeException {
        public DeviceNotFoundByOwnerException(Long id) {
            super(Messages.getMessageForLocale("tracker.error.device.not.found.by.owner", LocaleContextHolder.getLocale(), id));
        }
    }

    public static class CurrentSessionUserNotFoundException extends RuntimeException {
        public CurrentSessionUserNotFoundException() {
            super(Messages.getMessageForLocale("tracker.error.session.user.not.found", LocaleContextHolder.getLocale()));
        }
    }
}