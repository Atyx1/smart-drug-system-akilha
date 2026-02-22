package com.akilha.tracker.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CompartmentIndexValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCompartmentIndex {
    String message() default "Geçersiz çekmece numarası. 1 ile 4 arasında olmalı.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}