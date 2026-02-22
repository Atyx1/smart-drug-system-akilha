package com.akilha.tracker.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CompartmentIndexValidator implements ConstraintValidator<ValidCompartmentIndex, Integer> {
    @Override
    public boolean isValid(Integer idx, ConstraintValidatorContext context) {
        return idx != null && idx >= 1 && idx <= 4;
    }
}