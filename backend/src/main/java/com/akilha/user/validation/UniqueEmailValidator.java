package com.akilha.user.validation;


import com.akilha.user.entity.User;
import com.akilha.user.exception.UserExceptions;
import com.akilha.user.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;

import java.util.Optional;


@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator <UniqueEmail, String>{



  private final UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        Optional<User> inDb = userRepository.findByEmail(email);

        if (inDb.isPresent()) {
            throw new UserExceptions.NotUniqueEmailException();
        }

        return true;
    }
}
