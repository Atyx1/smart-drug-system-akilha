package com.akilha.message;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Messages {

    private static final Logger log = LoggerFactory.getLogger(Messages.class);


    public static String getMessageForLocale(String messageKey, Locale locale) {
        log.info("messageKey: " + messageKey);
        try {
            return ResourceBundle.getBundle("ValidationMessages", locale).getString(messageKey);
        } catch (MissingResourceException e) {
            log.error("Message key not found: " + messageKey, e);
            return messageKey; // veya varsayılan bir mesaj döndürebilirsiniz
        }
    }

    public static String getMessageForLocale(String messageKey, Locale locale,Object... args) {
        String message = getMessageForLocale(messageKey, locale);
        return MessageFormat.format(message, args);
    }
}