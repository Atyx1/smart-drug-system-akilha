package com.akilha.approve;



import com.akilha.device.entity.Device;
import com.akilha.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "pending_approvals")
@Getter
@Setter
public class PendingApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER) // LAZY yerine EAGER kullanalım
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "request_date")
    private LocalDate requestDate = LocalDate.now();

    /** İsteğin tipini ayırt edelim */
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ApprovalType type = ApprovalType.ROLE;   // default eski davranış

    /** Eğer viewer talebiyse, hangi cihaza? */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;

}

