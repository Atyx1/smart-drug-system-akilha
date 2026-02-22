package com.akilha.tracker.entity;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medicine_batches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MedicineBatch {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Bu batch hangi ilaçtan oluşuyor? */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medicine_id")
    private Medicine medicine;




    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "compartment_id")
    private Compartment compartment;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private LocalDateTime loadedAt;

    @PrePersist
    protected void onLoad() {
        loadedAt = LocalDateTime.now();
    }


    /**
     *   Dikkat: Eskiden burada
     *   @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL, orphanRemoval = true)
     *   yazıyordu.
     *   Şimdi “cascade” ve “orphanRemoval” kaldırıldı,
     *   böylece batch silindiğinde otomatik olarak tüm PillInstance’lar da silinmeyecek.
     */
    @OneToMany(mappedBy = "batch", fetch = FetchType.LAZY)
    private List<PillInstance> instances = new ArrayList<>();


    public MedicineBatch(Medicine medicine, Compartment compartment, int quantity) {
        this.medicine = medicine;
        this.compartment = compartment;
        this.quantity = quantity;
        this.loadedAt = LocalDateTime.now();
    }

    public void decrementQuantity() {
        if (this.quantity <= 0) {
            throw new IllegalStateException("Stok zaten tükenmiş, daha fazla eksiltilemez.");
        }
        this.quantity -= 1;
    }

}