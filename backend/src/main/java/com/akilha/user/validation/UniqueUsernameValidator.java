package com.akilha.user.validation;


import com.akilha.user.entity.User;
import com.akilha.user.exception.UserExceptions;
import com.akilha.user.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;

import java.util.Optional;


@RequiredArgsConstructor
public class UniqueUsernameValidator  implements ConstraintValidator<UniqueUsername,String> {


    private  final UserRepository userRepository;



    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        Optional<User> inDb = userRepository.findByUsername(username);

        if (inDb.isPresent()) {
            throw new UserExceptions.NotUniqueUsernameException();
        }

        return true;
    }
}
