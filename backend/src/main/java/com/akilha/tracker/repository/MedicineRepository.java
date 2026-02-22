package com.akilha.tracker.repository;





import com.akilha.user.entity.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import com.akilha.tracker.entity.Medicine;

import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {


}