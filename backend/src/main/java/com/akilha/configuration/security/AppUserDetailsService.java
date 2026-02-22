package com.akilha.configuration.security;

import com.akilha.user.entity.User;
import com.akilha.user.exception.UserExceptions;
import com.akilha.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public UserDetails loadUserByUsername(String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            throw new UserExceptions.UserNotFoundException();
        }
          return new CurrentUser(user);

    }



}
