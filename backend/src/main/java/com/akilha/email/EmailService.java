package com.akilha.email;

import com.akilha.configuration.properties.BackendProperties;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Properties;

@Slf4j
@Service
public class EmailService {

    private String url;
    private JavaMailSenderImpl mailSender;
    private final BackendProperties backendProperties;
    private final EmailTemplates emailTemplates;

    public EmailService(BackendProperties backendProperties, EmailTemplates emailTemplates) {
        this.backendProperties = backendProperties;
        this.emailTemplates = emailTemplates;
        initialize();
    }

    /**
     * Mail sunucusuna bağlanma ve parametrelerin ayarlanması.
     */
    private void initialize() {
        url = backendProperties.getDomain().url();
        this.mailSender = new JavaMailSenderImpl();
        mailSender.setHost(backendProperties.getEmail().host());
        mailSender.setPort(backendProperties.getEmail().port());
        mailSender.setUsername(backendProperties.getEmail().username());
        mailSender.setPassword(backendProperties.getEmail().password());

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.debug", "true");
    }

    /**
     * Aktivasyon e-postası gönderir.
     */
    public void sendActivationEmail(String email, String fullName, String activationCode) throws MessagingException {
        try {
            String activationLink = url + "/api/v1/users/activate?token=" + activationCode;
            String mailBody = emailTemplates.getActivationEmailTemplate()
                    .replace("${fullName}", fullName)
                    .replace("${date}", LocalDate.now().toString())
                    .replace("${activationLink}", activationLink);

            sendEmail(email, EmailConstants.ACTIVATION_SUBJECT, mailBody);
            log.info("Activation email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send activation email to: {}", email, e);
            throw new EmailSendException("Failed to send activation email", e);
        }
    }

    /**
     * Şifre değiştirme e-postası gönderir.
     */
    public void sendPasswordChangeEmail(String email, String fullName, String passwordResetCode) throws MessagingException {
        try {
            String passwordResetLink = url + "/api/v1/users/reset-password?token=" + passwordResetCode;
            String mailBody = emailTemplates.getPasswordResetEmailTemplate()
                    .replace("${fullName}", fullName)
                    .replace("${date}", LocalDate.now().toString())
                    .replace("${passwordResetLink}", passwordResetLink);

            sendEmail(email, EmailConstants.PASSWORD_RESET_SUBJECT, mailBody);
            log.info("Password reset email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", email, e);
            throw new EmailSendException("Failed to send password reset email", e);
        }
    }

    /**
     * Ortak mail gönderim metodu
     */
    private void sendEmail(String email, String subject, String body) throws MessagingException {
        try {
            MimeMessage mailMessage = mailSender.createMimeMessage();
            MimeMessageHelper message = new MimeMessageHelper(mailMessage, true, "UTF-8");
            message.setTo(email);
            message.setSubject(subject);
            message.setText(body, true);
            mailSender.send(mailMessage);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", email, e);
            throw new EmailSendException("Failed to send email", e);
        }
    }
}