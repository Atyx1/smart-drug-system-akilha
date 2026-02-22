package com.akilha.token;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository  extends JpaRepository<Token,Long>{

 @Transactional
 void deleteByToken(String token);

 Token findByUserId(Long id);

 Token findByToken(String token);

 boolean existsByUserId(Long userId);




}
