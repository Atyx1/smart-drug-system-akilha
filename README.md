# Akilha – Akıllı İlaç Hatırlatma ve Takip Sistemi

Akilha, düzenli / düzensiz ilaç kullanan hastalar ile onlara destek olan bakım-verenlerin ilaç planını güvenli şekilde takip edebilmesini sağlayan, Raspberry Pi tabanlı akıllı cihazla entegre bir yönetim platformudur.

---

## 🚀 Proje Özeti
| Katman        | Teknoloji / Araç                                               |
|---------------|----------------------------------------------------------------|
| **Mobile**    | React Native|
| **Backend**   | Spring Boot (Java 17+)                                         |
| **Veritabanı**| MySQL                                       |
| **Güvenlik**  | JWT + Spring Security                                          |
| **Bildirim**  | WebSocket (STOMP)                                              |
| **Cihaz**     | Raspberry Pi + Python (OpenCV)                                 |
| **Roller**    | `USER`, `ADMIN`, `MANAGER`(yönetici hakları)                         |

---

## 📦 Özellikler
- 🔐  JWT ile oturum açma / yenileme  
- 💊  İlaç, doz, periyot ve stok yönetimi  
- 🧠  Planlı & düzensiz kullanım tipleri  
- 📥  Fiziksel hazne (compartment) eşleme & güncelleme  
- 📸  Kamera ile ilaç alım tespiti, geç / geç alınmama bildirimleri  
- 📤  Gerçek-zamanlı WebSocket bildirimleri  
- 👨‍⚕️  Hasta–bakım veren istek/ onay akışı  
- 🧾  Ayrıntılı görev & aktivite günlüğü  

---

## 🧱 Proje Mimarisi


com.akilha
├── auth               → JWT, kayıt, giriş, parola sıfırlama
├── user               → Kullanıcı, roller, durum yönetimi
├── device             → Cihaz kaydı, eşleşme, viewer istekleri
├── compartment        → Bölme (hazne) CRUD & plan gönderimi
├── tracker            → Medicine, PillInstance, plan üretimi
├── notification       → WebSocket bildirim servisi
├── activitylog        → Kullanıcı / sistem log’ları
├── token              → Kalıcı token + blacklist
├── email              → SMTP & şablonlar
└── config             → Güvenlik, i18n, Swagger, scheduler








### **device-controller**
| Yöntem | Path                                                     | Operasyon                      |
|--------|----------------------------------------------------------|--------------------------------|
| PUT    | `/devices/{deviceId}`                                    | update                         |
| DELETE | `/devices/{deviceId}`                                    | delete                         |
| POST   | `/devices/register`                                      | register                       |
| POST   | `/devices/connectForManager`                             | connectDeviceAsAManager        |
| POST   | `/devices/caregiver/request`                             | caregiverRequest               |
| POST   | `/devices/caregiver/requests/{approvalId}/approve`       | approveRequest                 |
| POST   | `/devices/caregiver/requests/{approvalId}/reject`        | rejectRequest                  |
| POST   | `/devices/{deviceId}/caregiver/{userId}/block`           | blockViewer                    |
| GET    | `/devices/{deviceId}/caregiver/requests`                 | getPendingRequests             |
| GET    | `/devices/{deviceId}/caregiver/approved`                 | getApprovedViewers             |
| GET    | `/devices/my`                                            | myDevices                      |
| GET    | `/devices/my-device-id`                                  | getMyDeviceId                  |

### **compartment-controller**
| Yöntem | Path                                                     | Operasyon                      |
|--------|----------------------------------------------------------|--------------------------------|
| POST   | `/compartments`                                          | create                         |
| PUT    | `/compartments/update`                                   | update                         |
| GET    | `/compartments/device/{deviceId}`                        | list                           |
| DELETE | `/compartments/device/{deviceId}/idx/{idx}`              | deleteByDeviceAndIdx           |

### **pill-controller**
| Yöntem | Path                                  | Operasyon              |
|--------|---------------------------------------|------------------------|
| POST   | `/pills/{deviceId}/tray-emptied`      | confirmTrayEmptied     |
| POST   | `/pills/{deviceId}/drop`              | confirmDrop            |
| POST   | `/pills/{deviceId}/not-taken`         | confirmNotTaken        |

### **auth-controller**
| Yöntem | Path          | Operasyon             |
|--------|---------------|-----------------------|
| POST   | `/1.0/login`  | handleAuthentication  |
| POST   | `/1.0/logout` | handleLogout          |

### **activity-log-controller**
| Yöntem | Path                                   | Operasyon                   |
|--------|----------------------------------------|-----------------------------|
| GET    | `/v1/logs/pill-activities`             | getPillActivities           |
| GET    | `/v1/logs/notification-activities`     | getNotificationActivities   |
| GET    | `/v1/logs/device-activities`           | getDeviceActivities         |
| GET    | `/v1/logs/date-range`                  | getLogsForDateRange         |
| GET    | `/v1/logs/daily`                       | getDailyLogs                |
| GET    | `/v1/logs/activity-types`              | getActivityTypes            |


---

#### ▶️ device-controller

- **update** `PUT /devices/{deviceId}`  
  Cihazın adını veya şifresini günceller (yalnızca cihaz yöneticisi).

- **delete** `DELETE /devices/{deviceId}`  
  Cihazı, bölmelerini ve planlarını sistemden tamamen siler.

- **register** `POST /devices/register`  
  Raspberry Pi ilk kurulumda backend’e kendini kaydeder.

- **connectDeviceAsAManager** `POST /devices/connectForManager`  
  Kullanıcı, cihazı “yönetici” olarak hesabına tanımlar (ad-şifre doğrulaması).

- **caregiverRequest** `POST /devices/caregiver/request`  
  Başka bir cihazı görüntülemek için izin (viewer) talebi oluşturur.

- **approveRequest** `POST /devices/caregiver/requests/{approvalId}/approve`  
  Cihaz sahibi, bekleyen caregiver isteğini onaylar.

- **rejectRequest** `POST /devices/caregiver/requests/{approvalId}/reject`  
  Cihaz sahibi, caregiver isteğini reddeder.

- **blockViewer** `POST /devices/{deviceId}/caregiver/{userId}/block`  
  Daha önce onaylanmış bir görüntüleyiciyi cihazdan kaldırır.

- **getPendingRequests** `GET /devices/{deviceId}/caregiver/requests`  
  Seçili cihaz için bekleyen caregiver isteklerini listeler.

- **getApprovedViewers** `GET /devices/{deviceId}/caregiver/approved`  
  Cihaza erişimi onaylanmış tüm kullanıcıları listeler.

- **myDevices** `GET /devices/my`  
  Oturum sahibinin yönettiği veya görüntülediği cihazları getirir.

- **getMyDeviceId** `GET /devices/my-device-id`  
  Kullanıcının yönettiği tek bir cihaz varsa hızlıca o ID’yi döner.

---

#### ▶️ compartment-controller

- **create** `POST /compartments`  
  Cihazdaki fiziksel bölmeyi oluşturur, ilaç & plan atar.

- **update** `PUT /compartments/update`  
  Bölmede ilaç değişimi, stok güncellemesi veya plan revizyonu yapar.

- **list** `GET /compartments/device/{deviceId}`  
  Cihaza ait tüm bölme özetlerini (ilaç adı, stok %) döner.

- **deleteByDeviceAndIdx** `DELETE /compartments/device/{deviceId}/idx/{idx}`  
  Belirli slotu siler; ilgili planları ve cihaz görev dosyasını temizler.

---

#### ▶️ pill-controller

- **confirmTrayEmptied** `POST /pills/{deviceId}/tray-emptied`  
  Kullanıcı çekmeceyi boşalttığında stok & plan güncellenir.

- **confirmDrop** `POST /pills/{deviceId}/drop`  
  Pi, ilacı bölmeye bıraktığını onaylar (durum: *DISPENSED_WAITING*).

- **confirmNotTaken** `POST /pills/{deviceId}/not-taken`  
  İlaç zamanında alınmadıysa *MISSED* olarak işaretler, bildirim gönderir.

---

#### ▶️ auth-controller

- **handleAuthentication** `POST /1.0/login`  
  E-posta & şifre ile giriş; JWT access / refresh token üretir.

- **handleLogout** `POST /1.0/logout`  
  Geçerli JWT’yi kara listeye ekler, refresh cookie’yi temizler.

---

#### ▶️ activity-log-controller

- **getPillActivities** `GET /v1/logs/pill-activities`  
  Seçilen gün içindeki ilaç düşürme / alma kayıtları.

- **getNotificationActivities** `GET /v1/logs/notification-activities`  
  Aynı gün gönderilen bildirim olayları.

- **getDeviceActivities** `GET /v1/logs/device-activities`  
  Cihaz açma-kapama, bağlantı hatası vb. donanım aktiviteleri.

- **getLogsForDateRange** `GET /v1/logs/date-range`  
  Belirli tarih aralığında (ve opsiyonel kategoriyle) log dökümü.

- **getDailyLogs** `GET /v1/logs/daily`  
  Gün içindeki tüm kategorileri toplu listeler (dashboard).

- **getActivityTypes** `GET /v1/logs/activity-types`  
  Desteklenen `ActivityType` enum değerleri ve açıklamaları.

---

---
## 🗺️ Veritabanı ER Diyagramı
![Veritabanı ER Diyagramı](https://github.com/user-attachments/assets/6a04ddb5-5c14-4415-b279-6b72e328d24b)


### İlişki Özeti
| Tablo                | Temel Alan(lar)              | İlişki / Yabancı Anahtar                    |
|----------------------|------------------------------|---------------------------------------------|
| **users**            | `id`                         | 1 – N → **devices.owner_id**<br>1 – N → **tokens.user_id** |
| **devices**          | `id`, `owner_id`             | 1 – N → **compartments.device_id**<br>N – N (bridge) → **device_viewers** |
| **device_viewers**   | `device_id`, `user_id`       | çok-tan-çoğa: kullanıcılar ↔ cihazlar       |
| **compartments**     | `id`, `device_id`            | 1 – N → **medicine_batches.compartment_id** |
| **medicines**        | `id`                         | 1 – N → **medicine_batches.medicine_id**    |
| **medicine_batches** | `id`, `compartment_id`       | 1 – N → **pill_instances.batch_id**         |
| **pill_instances**   | `id`, `batch_id`             | 1 – 1 → **dropped_pill_tray.pill_instance_id** |
| **dropped_pill_tray**| `id`, `pill_instance_id`     | –                                          |
| **pending_approvals**| `id`, `user_id`, `device_id` | bekleyen caregiver / rol istekleri          |
| **tokens**           | `id`, `user_id`              | kalıcı JWT / black-list                     |
| **activity_logs**    | `id`, `username`             | sistem + kullanıcı olay günlükleri          |
