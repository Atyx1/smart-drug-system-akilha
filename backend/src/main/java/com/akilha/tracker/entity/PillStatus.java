package com.akilha.tracker.entity;



public enum PillStatus {
    PENDING,            // Zamanı henüz gelmedi
    DISPENSED_WAITING,  // Hap çekmeceye düştü, alınmayı bekliyor
    TAKEN_ON_TIME,      // Hastanın zamanında aldığı onaylandı
    TAKEN_LATE,         // “Alınmadı” bildirimi sonra­sında geç alındı
    MISSED              // Süre bitti, hap hâlâ alınmadı
}