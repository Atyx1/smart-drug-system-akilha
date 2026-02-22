package com.akilha.logging.entity;

public enum ActivityType {

    // Kullanıcı işlemleri
    USER_LOGIN("Kullanıcı Girişi"),
    USER_LOGOUT("Kullanıcı Çıkışı"),
    USER_REGISTERED("Kullanıcı Kaydı"),
    USER_PASSWORD_RESET("Şifre Sıfırlama"),
    USER_UPDATED("Kullanıcı Bilgisi Güncelleme"),
    
    // Cihaz İstek/Onay İşlemleri
    DEVICE_REQUEST_SUBMITTED("Cihaz Erişim İsteği Gönderildi"),
    DEVICE_REQUEST_APPROVED("Cihaz Erişim İsteği Onaylandı"),
    DEVICE_REQUEST_REJECTED("Cihaz Erişim İsteği Reddedildi"),
    DEVICE_VIEWER_ADDED("Cihaza Yakın Eklendi"),
    DEVICE_VIEWER_REMOVED("Cihazdan Yakın Kaldırıldı"),
    
    // İlaç ve Bölme İşlemleri
    COMPARTMENT_CREATED("Bölme Oluşturuldu"),
    COMPARTMENT_UPDATED("Bölme Güncellendi"),
    COMPARTMENT_DELETED("Bölme Silindi"),

    MEDICINE_ADDED("İlaç Eklendi"),
    MEDICINE_UPDATED("İlaç Güncellendi"),
    
    // İlaç Düşürme ve Alma İşlemleri
    PILL_DROPPED("İlaç Düşürüldü"),
    PILL_TAKEN("İlaç Alındı"),
    PILL_NOT_TAKEN("İlaç Alınmadı"),
    PILL_DISPENSED("İlaç Dağıtıldı"),
    
    // Bildirim İşlemleri
    NOTIFICATION_SENT("Bildirim Gönderildi"),
    NOTIFICATION_FAILED("Bildirim Gönderilemedi"),
    PILL_DROP_NOTIFICATION("İlaç Düşürme Bildirimi"),
    COMPARTMENT_CREATION_NOTIFICATION("Bölme Oluşturma Bildirimi"),
    
    // Sistem İşlemleri
    SYSTEM_ERROR("Sistem Hatası"),
    API_CALL("API Çağrısı"),
    DATABASE_OPERATION("Veritabanı İşlemi");

    private final String description;

    ActivityType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 