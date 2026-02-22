package com.akilha.user.repository;

import com.akilha.user.entity.Role;
import com.akilha.user.entity.User;
import com.akilha.user.entity.UserStatus;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Primary
public interface UserRepository extends JpaRepository<User, Long> {

    // Temel sorgular - Optional kullanımı daha güvenli
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByActivationCode(String activationCode);
    Optional<User> findByPasswordResetCode(String token);
    List<User> findByDeletedFalse();




    // Var olan kodları bulma
    @Query("SELECT u.passwordResetCode FROM User u WHERE u.passwordResetCode IS NOT NULL")
    List<String> findAllPasswordResetCodes();

    @Query("SELECT u.activationCode FROM User u WHERE u.activationCode IS NOT NULL")
    List<String> findAllActivationCodes();








    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = :username AND u.email = :email")
    boolean existsByUsernameAndEmail(String username, String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.passwordResetCode = :resetCode")
    boolean existsByPasswordResetCode(String resetCode);

    // Kullanıcı durumu güncelleme
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id = :userId")
    void updateUserStatus(Long userId, UserStatus status);

    // Rol güncelleme
    @Modifying
    @Query("UPDATE User u SET u.role = :role WHERE u.id = :userId")
    void updateUserRole(Long userId, Role role);


    boolean existsByEmail(String email);


    boolean existsByUsername(String username);
}