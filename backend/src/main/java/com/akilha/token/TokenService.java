package com.akilha.token;



import com.akilha.auth.dto.Credentials;
import com.akilha.user.entity.User;
import org.springframework.stereotype.Service;

@Service

public interface TokenService {

    Token createToken(User user, Credentials credentials);

    User verifyToken(String authorizationHeader);

    void deleteToken(String authorizationHeader);

    boolean isUserHaveToken(User user);


}
