package com.akilha.approve;



import com.akilha.message.Messages;
import org.springframework.context.i18n.LocaleContextHolder;

public class ApprovalExceptions {

    public static class ApprovalNotFoundException extends RuntimeException {
        public ApprovalNotFoundException(Long id) {
            super(Messages.getMessageForLocale("approval.error.not.found.with.id", LocaleContextHolder.getLocale(), id));
        }
    }

    public static class NotViewerRequestException extends RuntimeException {
        public NotViewerRequestException() {
            super(Messages.getMessageForLocale("approval.error.not.viewer.request", LocaleContextHolder.getLocale()));
        }
    }

    public static class ViewerApprovalAccessDeniedException extends RuntimeException {
        public ViewerApprovalAccessDeniedException() {
            super(Messages.getMessageForLocale("approval.error.access.denied", LocaleContextHolder.getLocale()));
        }
    }
}