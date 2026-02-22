// Türkçe (tr) çeviriler
export const trTranslations = {
  // Genel
  app_name: "İlaç Takip",
  cancel: "İptal",
  save: "Kaydet",
  delete: "Sil",
  edit: "Düzenle",
  ok: "Tamam",
  yes: "Evet",
  no: "Hayır",
  general_error: "Bir hata oluştu",
  back: "Geri",
  next: "İleri",
  home: "Ana Sayfa",
  select_users: "Kullanıcı Seç",
  all_users: "Tüm Kullanıcılar",
  activity_types: "Aktivite Tipleri",
  show: "Göster",
  hide: "Gizle",
  admin: "Ebeveyn/Yakın",
  manager: "Cihaz Sahibi",

  // Dashboard texts
  admin_dashboard: "Yönetici Paneli",
  welcome_admin_message: "Yönetici paneline hoş geldiniz",
  manager_dashboard: "Doktor Paneli",
  welcome_message: "Hoş geldiniz",

  // IoT Medication Tracking
  patient_profile: "Hasta Profili",
  doctor_profile: "Doktor Profili",
  medication_tracking: "İlaç Takibi",
  compartments: "Bölmeler",
  patient_data: "Hasta Verileri",
  device_settings: "Cihaz Ayarları",
  system_settings: "Sistem Ayarları",
  patient_management: "Hasta Yönetimi",
  end_session: "Oturumu Sonlandır",
  end_doctor_session: "Doktor Oturumunu Sonlandır",
  end_admin_session: "Yönetici Oturumunu Sonlandır",
  device_management: "Cihaz Yönetimi",
  system_admin: "Sistem Yönetimi",
  medication_logs: "İlaç Kayıtları",
  medication_history: "İlaç Geçmişi",
  doctor_settings: "Doktor Ayarları",
  patients: "Hastalar",

  // Hasta ve Cihaz Detayları
  tap_to_view_patient_details: "Hasta detaylarını görmek için dokun",
  no_devices_assigned: "Bu hastaya atanmış cihaz yok",
  patient_details: "Hasta Detayları",
  device_users: "Cihaz Kullanıcıları",

  // Medication Step Indicator
  medication_type: "İlaç Tipi",
  photo: "Fotoğraf",
  details: "Detaylar",
  preview: "Önizleme",

  // Aktivite Logları
  activity_logs: "Aktivite Logları",
  no_logs: "Kayıt bulunamadı",
  loading_more: "Daha fazla yükleniyor...",
  total_logs_count: "Toplam {{count}} kayıt bulundu",
  unknown: "Bilinmeyen",
  no_logs_found: "Log kaydı bulunamadı",
  logs: "Günlükler",
  search_logs: "Loglarda Ara",
  log_details: "Log Detayları",
  log_date: "Tarih",
  log_daily: "Günlük Loglar",
  log_summary: "Özet Bilgiler",
  filter_logs: "Logları Filtrele",
  date_range: "Tarih Aralığı",
  all: "Tümü",
  activity_distribution: "Aktivite Dağılımı",
  charts_coming_soon: "Grafikler yakında eklenecek",
  total_logs: "Toplam Kayıt",
  success_count: "Başarılı",
  error_count: "Hatalı",
  user_count: "Kullanıcı Sayısı",
  facility_count: "Sağlık Kurumu Sayısı",
  today: "Bugün",
  last_7_days: "Son 7 Gün",
  last_30_days: "Son 30 Gün",
  loading: "Yükleniyor",
  advanced_search: "Filtrele",
  search_by_username: "Kullanıcı adına göre ara",
  enter_username: "Kullanıcı adını girin",

  // Aktivite Tipleri - Düz yapı
  activity_type_MEDICATION_ADDED: "İlaç Eklendi",
  activity_type_MEDICATION_UPDATED: "İlaç Güncellendi",
  activity_type_MEDICATION_DELETED: "İlaç Silindi",
  activity_type_MEDICATION_SEARCHED: "İlaç Arandı",
  activity_type_MEDICATION_TAKEN: "İlaç Alındı",
  activity_type_MEDICATION_MISSED: "İlaç Kaçırıldı",
  activity_type_USER_LOGIN: "Kullanıcı Girişi",
  activity_type_USER_LOGOUT: "Kullanıcı Çıkışı",
  activity_type_USER_REGISTERED: "Kullanıcı Kaydı",
  activity_type_USER_PASSWORD_RESET: "Şifre Sıfırlama",
  activity_type_USER_UPDATED: "Kullanıcı Güncellendi",
  activity_type_DEVICE_ADDED: "Cihaz Eklendi",
  activity_type_DEVICE_UPDATED: "Cihaz Güncellendi",
  activity_type_DEVICE_DELETED: "Cihaz Silindi",
  activity_type_DEVICE_PAIRED: "Cihaz Eşleştirildi",
  activity_type_DEVICE_SYNC: "Cihaz Senkronize Edildi",
  activity_type_SYSTEM_ERROR: "Sistem Hatası",
  activity_type_API_CALL: "API Çağrısı",
  activity_type_DATABASE_OPERATION: "Veritabanı İşlemi",
  activity_type_USER_CREATED: "Kullanıcı Oluşturuldu",
  activity_type_USER_DELETED: "Kullanıcı Silindi",
  activity_type_PASSWORD_CHANGED: "Şifre Değiştirildi",
  activity_type_PERMISSION_CHANGED: "İzin Değiştirildi",
  activity_type_MEDICATION_EXPORTED: "İlaç Kayıtları Dışa Aktarıldı",
  activity_type_MEDICATION_IMPORTED: "İlaç Kayıtları İçe Aktarıldı",

  // İlaç Takip Terimleri
  medication: {
    title: "İlaç Takibi",
    history: "İlaç Geçmişi",
    schedule: "İlaç Programı",
    reminder: "İlaç Hatırlatması",
    dosage: "Dozaj",
    frequency: "Sıklık",
    time: "Zaman",
    instructions: "Talimatlar",
    side_effects: "Yan Etkiler",
    interactions: "Etkileşimler",
    adherence: "Uyum",
    missed_dose: "Kaçırılan Doz",
    taken: "Alındı",
    skipped: "Atlandı",
    delayed: "Geciktirildi",
    refill: "Yenileme",
    pharmacy: "Eczane",
    prescription: "Reçete",
    doctor: "Doktor",
    patient: "Hasta",
    device: "IoT Cihazı",
    device_status: "Cihaz Durumu",
    device_battery: "Cihaz Pili",
    device_connectivity: "Cihaz Bağlantısı",
    device_sync: "Cihaz Senkronizasyonu",
    device_setup: "Cihaz Kurulumu",
    device_pairing: "Cihaz Eşleştirme",
  },

  // Eksik çeviriler
  medication_number: "İlaç Numarası",
  date: "Tarih",
  user_information: "Kullanıcı Bilgisi",
  photos: "Fotoğraflar",
  location: "Konum",
  address: "Adres",
  phone_format: "Telefon Formatı",
  enter: "giriniz",
  update: "Güncelle",

  // Device Management Çevirileri
  connect_to_device: "Cihaza Bağlan",
  device_name: "Cihaz Adı",
  device_password: "Cihaz Şifresi",
  enter_device_name: "Cihaz adını girin",
  enter_device_password: "Cihaz şifresini girin",
  enter_device_credentials_to_pair:
    "Cihaz adı ve şifresini girerek eşleştirme yapın",
  device_connected_successfully: "Cihaz başarıyla bağlandı",
  connection_failed: "Bağlantı Başarısız",
  check_device_credentials: "Cihaz bilgilerini kontrol edin",
  device_connection_info:
    "Cihaz bağlantısı için cihazınızın yanınızda olduğundan ve şifrenin doğru olduğundan emin olun.",

  // Relative Device Çevirileri
  relatives_device: "Yakınınızın Cihazı",
  send_device_share_request: "Cihaz paylaşım talebi gönderin",
  enter_relatives_device_name: "Yakınınızın cihaz adını girin",
  device_sharing: "Cihaz Paylaşımı",
  view_relatives_medication_data: "Yakınınızın ilaç verilerini görüntüleyin",
  real_time_notifications: "Anlık Bildirimler",
  get_notified_about_medication_status: "İlaç durumu hakkında bildirim alın",
  send_request: "Talep Gönder",
  request_sent_successfully: "Talebiniz başarıyla gönderildi",
  device_share_request_info:
    "Talebiniz cihaz sahibine iletilecektir. Onaylandıktan sonra cihaz verilerini görüntüleyebilirsiniz.",
  privacy_security_note:
    "Tüm veriler şifreli olarak iletilir ve güvenlik protokolleri ile korunur.",
  request_failed: "Talep Başarısız",
  request_could_not_be_sent: "Talep gönderilemedi",
  please_enter_device_name: "Lütfen cihaz adını girin",
  please_fill_all_fields: "Lütfen tüm alanları doldurun",
  error: "Hata",
  success: "Başarılı",

  // Hakkında Sayfası
  about_app: "Uygulama Hakkında",
  about_app_description:
    "İlaç Takip, ilaçlarınızı ve tedavi planınızı kolayca takip etmenizi sağlayan, sağlığınızı yönetmenize yardımcı olan modern bir uygulamadır. IoT cihazları ile entegre çalışarak ilaç alımınızı izlemenize ve doktorunuzla paylaşmanıza olanak tanır.",
  features: "Özellikler",
  device_support: "IoT Cihaz Desteği",
  track_medication_intake: "İlaç alımını takip et ve kaydet",
  different_medication_types: "Farklı İlaç Tipleri",
  manage_medication_schedule:
    "Günlük, haftalık ve aylık ilaç programlarını yönet",
  filter_by_date_device_type: "Tarih, cihaz ve ilaç tipine göre filtrele",
  user_management: "Kullanıcı Yönetimi",
  different_roles_permissions: "Farklı rol ve izin seviyeleri",
  contact: "İletişim",
  all_rights_reserved: "Tüm hakları saklıdır",

  // Gizlilik Sayfası
  privacy_policy: "Gizlilik Politikası",
  privacy_intro:
    "Bu gizlilik politikası, İlaç Takip uygulamasını kullanırken toplanan, kullanılan ve korunan bilgileriniz hakkında sizi bilgilendirmek için hazırlanmıştır.",
  collected_information: "Toplanan Bilgiler",
  collected_information_desc:
    "Uygulamamız, hesabınızı oluşturmak ve yönetmek için gerekli kişisel bilgilerinizi (ad, e-posta, telefon numarası) ve ilaç kullanımı ile ilgili bilgileri toplar.",
  data_usage: "Verilerin Kullanımı",
  data_usage_desc:
    "Topladığımız bilgiler, hizmetlerimizi sunmak, geliştirmek ve kişiselleştirmek için kullanılır. Verileriniz satılmaz veya üçüncü taraflarla paylaşılmaz.",
  data_security: "Veri Güvenliği",
  data_security_desc:
    "Bilgilerinizin güvenliği bizim için önemlidir. Bilgilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz. Tüm veriler şifrelenir ve güvenli sunucularda saklanır.",
  cookies: "Çerezler ve Benzer Teknolojiler",
  cookies_desc:
    "Uygulamamız, deneyiminizi iyileştirmek için çerezler ve benzer teknolojiler kullanabilir. Bu teknolojiler, tercihlerinizi hatırlamak ve uygulamayı daha verimli hale getirmek için kullanılır.",
  privacy_contact_desc:
    "Gizlilik politikamızla ilgili sorularınız veya endişeleriniz varsa, lütfen bizimle support@medicationtracker.com adresinden iletişime geçin.",
  last_updated: "Son güncelleme",
  june: "Haziran",

  // Form validasyon mesajları
  facility_name_required: "Sağlık kurumu adı zorunludur",
  facility_name_min_length: "Sağlık kurumu adı en az 2 karakter olmalıdır",
  location_required: "Konum bilgisi zorunludur",
  location_min_length: "Konum bilgisi çok kısa",
  phone_required: "Telefon numarası zorunludur",
  phone_start_with_5: "Telefon numarası 5 ile başlamalıdır",
  phone_length: "Telefon numarası 10 haneli olmalıdır (5XX-XXX-XX-XX)",
  phone_format_invalid: "Geçerli bir telefon numarası giriniz (5XX-XXX-XX-XX)",
  address_required: "Adres bilgisi zorunludur",
  address_min_length: "Adres detaylı olmalıdır",

  // Görev (Task) Çevirileri
  tasks: {
    title: "Görevler",
    today: "Bugünkü Görevler",
    history: "Görev Geçmişi",
    managed: "Yönetilen Görevler",
    create: "Görev Oluştur",
    detail: "Görev Detayı",
    subtitle: "Bugünkü görevleriniz",
    manage_tab: "Görevleri Yönet",
    status: {
      pending: "Bekliyor",
      completed: "Tamamlandı",
      completed_late: "Geç Tamamlandı",
      expired: "Süresi Doldu",
    },
    complete_task: "Görevi Tamamla",
    task_complete_success: "Görev başarıyla tamamlandı",
    task_complete_error: "Görev tamamlanırken hata oluştu",
    submit: {
      title: "Görev Tamamlama",
      comment: "Notunuz",
      comment_required: "Not alanı zorunludur",
      add_photo: "Fotoğraf Ekle",
      submit_button: "Tamamla",
      cancel_button: "İptal",
    },
  },

  // Kullanıcı Rolleri
  user: "Kullanıcı",
  store_manager: "Mağaza Müdürü",

  // Kullanıcı Durumları
  status_active: "Aktif",
  status_inactive: "Pasif",
  status_pending: "Onay Bekliyor",
  status_approved: "Onaylandı",
  status_rejected: "Reddedildi",

  // Giriş/Kayıt Ekranları
  login: "Giriş",
  login_fields_required: "Lütfen e-posta ve şifre alanlarını doldurun.",
  login_error: "Giriş yapılırken bir hata oluştu.",
  no_account: "Hesabınız yok mu?",
  create_account: "Hesap Oluştur",
  register: "Kayıt Ol",
  email: "E-posta",
  password: "Şifre",
  confirm_password: "Şifre Tekrar",
  forgot_password: "Şifremi Unuttum",
  login_screen: "Giriş Ekranına Dön",
  login_welcome: "Hoş Geldiniz",
  login_tagline: "Fiş Takip uygulamasına giriş yapın",

  // Şifremi Unuttum Ekranı
  password_reset: "Şifremi Unuttum",
  reset_password_subtitle:
    "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.",
  reset_link_sent: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi",
  reset_failed: "Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin.",
  empty_email: "E-posta adresi boş bırakılamaz",
  send_reset_link: "Gönder",
  sent: "Gönderildi",

  // Kayıt İşlemi
  select_store_required: "Lütfen bir şube seçin",
  fullname_required: "Ad Soyad alanı boş bırakılamaz",
  username_required: "Kullanıcı adı boş bırakılamaz",
  username_min_length: "Kullanıcı adı en az 3 karakter olmalıdır",
  email_required: "E-posta adresi boş bırakılamaz",
  email_invalid: "Geçerli bir e-posta adresi girin",
  password_required: "Şifre boş bırakılamaz",
  password_requirements:
    "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir",
  password_requirements_text:
    "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.",
  passwords_not_match: "Şifreler eşleşmiyor",
  email_in_use: "Bu e-posta adresi zaten kullanımda",
  username_in_use: "Bu kullanıcı adı zaten kullanımda",
  availability_check_error:
    "Kullanılabilirlik kontrolü sırasında bir hata oluştu",
  personal_information: "Kişisel Bilgiler",
  enter_your_personal_details: "Kişisel bilgilerinizi girin",
  secure_your_account: "Hesabınızı Güvenleyin",
  secure_account: "Hesap Güvenliği",
  create_secure_password: "Hesabınız için güçlü bir şifre oluşturun",
  previous_step: "Önceki",
  back_to_login: "Girişe Dön",
  registration_success: "Kayıt başarılı!",
  registration_failed: "Kayıt başarısız oldu. Lütfen tekrar deneyin.",
  registration_complete: "Kayıt Tamamlandı!",
  personal_info: "Kişisel Bilgiler",
  enter_personal_info: "Kişisel bilgilerinizi girin",
  confirm_password_placeholder: "Şifrenizi onaylayın",
  password_requirements:
    "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir",
  password_must_contain:
    "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir",
  registration_success_message:
    "Hesabınız başarıyla oluşturuldu. Giriş yaparak uygulamayı kullanmaya başlayabilirsiniz.",
  registration_success_title: "Kayıt Başarılı!",
  registration_success_text:
    "Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.",
  previous_step: "Önceki Adım",
  register_step3: "Güvenlik",
  register_submit: "Kayıt Ol",
  select_store: "Çalışacağınız şubeyi seçin",
  enter_account_info: "Hesap bilgilerinizi girin",
  create_password: "Şifrenizi oluşturun",

  // Input Placeholders
  fullname_placeholder: "Ad Soyad",
  username_placeholder: "Kullanıcı Adı",
  email_placeholder: "E-posta",
  password_placeholder: "Şifre",
  password_confirm_placeholder: "Şifre Tekrar",

  // Ana Menü
  profile: "Profil",
  settings: "Ayarlar",
  logout: "Çıkış Yap",
  logging_out: "Çıkış yapılıyor...",
  pending_approvals: "Talepler",

  // Profil Ekranı
  change_password: "Şifre Değiştir",
  change_passwords: "Şifre Değiştir",
  personal_info_profile: "Kişisel Bilgiler",
  full_name: "Ad Soyad",
  username: "Kullanıcı Adı",
  role: "Rol",
  store: "Şube",
  account_status: "Hesap Durumu",

  // Yönetici Menüsü
  users: "Kullanıcılar",
  stores: "Şubeler",
  receipt_search: "Fiş Arama",

  // Fiş Ekranları
  daily_receipts: "Günlük Fişler",
  history: "Geçmiş",
  add_receipt: "Fiş Ekle",
  receipt_details: "Fiş Detayları",
  daily_receipt: "Günlük Fiş",

  // Session History Screen
  cannot_process: "İşlem Yapılamaz",
  complete_receipt_first: "Lütfen öncesinde mevcut fiş işlemini tamamlayın.",
  delete_receipt: "Fiş Sil",
  confirm_delete_receipt: "Bu fişi silmek istediğinizden emin misiniz?",
  success: "Başarılı",
  receipt_deleted: "Fiş başarıyla silindi.",
  error: "Hata",
  receipt_delete_error: "Fiş silinirken bir hata oluştu.",
  receipt_not_found: "Fiş bulunamadı",
  receipt_edit_error: "Fiş düzenleme başlatılırken bir hata oluştu",
  no_receipts_yet: "Henüz fiş bulunmuyor",
  unknown_user: "Bilinmeyen Kullanıcı",

  // Receipt Search Screen
  data_loading_error: "Veri yüklenirken bir hata oluştu.",
  search_error: "Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.",
  user_id: "Kullanıcı {{id}}",
  store_id: "Mağaza {{id}}",
  no_results_found: "Arama kriterlerinize uygun fiş bulunamadı",

  // Kullanıcı Yönetimi Ekranı
  users_management: "Kullanıcı Yönetimi",
  no_users_found: "Kullanıcı Bulunamadı",
  no_users_registered: "Sistemde kayıtlı kullanıcı bulunmuyor.",
  view_user_details: "Kullanıcı detaylarını görüntüle",

  // Kullanıcı Detay Ekranı
  user_info: "Kullanıcı Bilgileri",
  username_label: "Kullanıcı Adı",
  status_label: "Durum",
  active_label: "Aktivasyon",
  active_status: "Aktif",
  inactive_status: "Pasif",
  unassigned: "Atanmamış",
  set_role: "Rol Belirle",
  admin_role: "Admin",
  manager_role: "Yönetici",
  restrict_access: "Erişimi Kısıtla",
  assign_store: "Mağaza Ata",
  other_actions: "Diğer İşlemler",
  delete_user: "Sil",
  confirm_admin_role: "Kullanıcıyı admin yapmak istediğinize emin misiniz?",
  confirm_manager_role:
    "Kullanıcıyı yönetici yapmak istediğinize emin misiniz?",
  confirm_user_role:
    "Kullanıcının erişimini kısıtlamak istediğinize emin misiniz?",
  confirm_delete_user: "Kullanıcıyı silmek istediğinize emin misiniz?",
  user_action_confirm: "Bu işlemi gerçekleştirmek istediğinize emin misiniz?",
  user_approved_admin: "Kullanıcı admin olarak onaylandı",
  user_approved_manager: "Kullanıcı yönetici olarak onaylandı",
  user_access_restricted: "Kullanıcı erişimi kısıtlandı",
  user_deleted: "Kullanıcı silindi",
  operation_failed: "İşlem başarısız",
  action_confirmation: "İşlem Onayı",
  attention: "Dikkat",

  // Şube Yönetimi Ekranı
  store_management: "Şube Yönetimi",
  new_store: "Yeni Şube",
  edit_store: "Şube Düzenle",
  store_name: "Şube Adı",
  store_created: "Şube başarıyla oluşturuldu",
  store_updated: "Şube başarıyla güncellendi",
  store_deleted: "Şube başarıyla silindi",
  store_create_error: "İşlem sırasında bir hata oluştu",
  store_delete_error: "Şube silinirken bir hata oluştu",
  store_delete_error_has_relations:
    "Bu mağaza kullanıcı veya fiş kayıtlarına sahip olduğu için silinemez.",
  confirm_store_delete: "{{name}} şubesini silmek istediğinizden emin misiniz?",
  store_delete_confirmation_title: "Şube Silme",
  store_delete_confirmation_message:
    "{{storeName}} şubesini silmek istediğinizden emin misiniz?",

  // Ayarlar Ekranı
  general: "Genel",
  appearance: "Görünüm",
  language: "Dil",
  notifications: "Bildirimler",
  dark_mode: "Karanlık Mod",
  light_mode: "Aydınlık Mod",
  system_theme: "Sistem Teması",
  app_version: "Uygulama Versiyonu",
  select_language: "Dil Seçin",
  turkish: "Türkçe",
  english: "İngilizce",
  account: "Hesap",
  privacy: "Gizlilik",
  about: "Hakkında",

  // Şifre Değiştirme
  current_password: "Mevcut Şifre",
  new_password: "Yeni Şifre",
  confirm_new_password: "Yeni Şifre Tekrar",
  password_changed: "Şifreniz başarıyla değiştirildi",
  password_error: "Şifre değiştirme işlemi başarısız oldu",
  create_strong_password: "Güvenliğiniz için güçlü bir şifre oluşturun",
  fill_all_fields: "Tüm alanları doldurun",

  // Onay Bekleyen Talepler Ekranı
  permission_request: "Yetki Talebi",
  waiting_for_system_authorization:
    "Sistem yetkilendirmesi için onay bekleniyor.",
  please_try_again_later: "Lütfen {{minutes}} dakika sonra tekrar deneyiniz.",
  active_user: "Aktif kullanıcısınız",
  no_pending_requests: "Bekleyen talep bulunmuyor",
  submission: "Gönderim",

  // Create Components
  basic_info: "Temel Bilgiler",
  store_selection: "Mağaza Seçimi",
  default_store: "Kayıtlı Mağaza",
  receipt_summary: "{{store}} için {{date}} tarihli fiş",

  step_x_of_y: "Adım {{current}}/{{total}}",
  select_receipt_type: "Fiş Tipi Seçin",
  select_receipt_type_description: "Oluşturmak istediğiniz fiş türünü seçin",

  permission_required: "İzin Gerekli",
  gallery_permission_required: "Fotoğraf seçmek için galeri izni gereklidir.",
  warning: "Uyarı",
  image_already_added: "Bu fotoğraf zaten eklenmiş",
  max_images_limit: "En fazla {{count}} fotoğraf ekleyebilirsiniz",
  image_pick_error: "Fotoğraf seçilirken bir hata oluştu",
  delete_image: "Fotoğrafı Sil",
  confirm_delete_image: "Bu fotoğrafı silmek istediğinizden emin misiniz?",

  finish: "Tamamla",

  // Common Components
  bank_selection: "Banka seçimi",
  clear_selection: "Seçimi Temizle",

  start_date: "Başlangıç Tarihi",
  end_date: "Bitiş Tarihi",

  confirm: "Onayla",

  account_updated: "Hesap Bilgileriniz Güncellendi",
  status: "Durum",
  login_again_message:
    "Değişikliklerin geçerli olması için lütfen yeniden giriş yapın.",

  // Search and Filter Components
  search: "Ara",

  clear: "Temizle",
  no_receipts_on_this_date: "Bu tarihte fiş bulunmuyor",

  // Receipt Types
  receipt_type_cash: "Nakit",
  receipt_type_pos: "Kart",
  receipt_type_expense: "Gider",

  // Receipt Type Descriptions
  receipt_type_cash_desc: "Nakit para ile yapılan ödemeler için",
  receipt_type_pos_desc: "Kredi kartı ile yapılan ödemeler için",
  receipt_type_expense_desc: "Çeşitli gider ve harcamalar için",

  // Receipt Type Form Fields
  invoice_information: "Fatura bilgileri",
  money_denominations: "Para birimleri",

  // Image Upload Component
  receipt_photos: "Fiş Fotoğrafları",
  receipt_photos_edit_mode: "Fiş Fotoğrafları (Düzenleme Modu)",
  take_photo: "Fotoğraf Çek",
  select_from_gallery: "Galeriden Seç",
  processing_image: "Fotoğraf işleniyor...",
  original_photos_preserved: "Düzenleme modunda orijinal fotoğraflar korunur",
  add_receipt_photos: "Fiş fotoğraflarını ekleyin veya çekin",
  at_least_one_photo: "En az bir fiş fotoğrafı eklemelisiniz",
  original_photos_must_be_preserved:
    "Düzenleme modunda orijinal fotoğraflar korunmalıdır",

  // Money Details
  total_amount: "Toplam Tutar",
  money_details: "Para Detayları",
  coins: "Bozuk Para",
  total_amount_must_be_greater_than_zero:
    "Toplam tutar sıfırdan büyük olmalıdır",

  // Auth screens
  name: "Ad",
  surname: "Soyad",
  phone: "Telefon",
  signin: "Giriş Yap",
  signup: "Kayıt Ol",
  welcome: "Hoş Geldiniz",
  welcome_back: "Tekrar Hoş Geldiniz",
  have_account: "Zaten hesabınız var mı?",
  reset_password: "Şifreyi Sıfırla",
  reset_password_text: "Şifrenizi sıfırlamak için e-posta adresinizi girin.",
  reset_password_sent: "Şifre sıfırlama bağlantısı gönderildi.",
  reset_password_check_email:
    "Şifre sıfırlama talimatları için e-postanızı kontrol edin.",
  go_to_login: "Giriş Yap",

  // Validations
  field_required: "Bu alan zorunludur",
  password_length: "Şifre en az 6 karakter olmalıdır",
  password_match: "Şifreler eşleşmiyor",
  invalid_credentials: "Geçersiz e-posta veya şifre",

  // Alert Messages
  alert_title: "Uyarı",
  success_title: "Başarılı",
  error_title: "Hata",
  ongoing: "Devam Ediyor",
  continue: "Devam Et",

  // Receipt Components
  // Bank Selector
  select_bank: "Banka Seçin",
  no_bank_selected: "Banka seçilmedi",

  // POS Receipt Form
  pos_receipt_details: "POS Fiş Detayları",
  show_details: "Detayları Göster",
  hide_details: "Detayları Gizle",
  bank_not_selected: "Banka seçilmedi",
  bank_information: "Banka Bilgileri",
  invoice_number: "Fatura Numarası",
  invoice_date: "Fatura Tarihi",
  invoice_amount: "Fatura Miktarı",
  invoice_number_required: "Fatura numarası zorunludur",
  invoice_date_required: "Fatura tarihi zorunludur",
  enter_valid_amount: "Geçerli bir tutar giriniz",
  enter_invoice_number: "Fatura numarasını girin",
  fill_all_required_fields: "Lütfen tüm zorunlu alanları doldurun",
  bank_selection_required: "Banka seçimi zorunludur",

  // Cash Receipt Form
  cash_details: "Para Detayları",
  total_must_be_greater_than_zero: "Toplam tutar sıfırdan büyük olmalıdır",

  // Expense Receipt Form
  total: "Toplam",
  description: "Açıklama",
  expense_amount: "Gider Miktarı",
  new_expense: "Yeni Gider",
  at_least_one_expense_item_required: "En az bir gider kalemi eklenmelidir",
  description_required: "Açıklama gerekli",

  // Date Picker
  select_date: "Tarih Seçin",

  // Search Components
  filter: "Filtrele",

  all_stores: "Tüm Mağazalar",
  all_receipt_types: "Tüm Fiş Tipleri",
  cash: "Nakit",
  pos: "POS",
  expense: "Gider",
  receipt_type_selection: "Fiş Tipi Seçimi",
  cash_receipt: "Nakit Fiş",
  pos_receipt: "POS Fiş",
  expense_receipt: "Gider Fiş",
  try_different_filters: "Farklı filtreler deneyin",
  apply_filters: "Filtreleri Uygula",
  clear_filters: "Filtreleri Temizle",
  no_results: "Sonuç Bulunamadı",
  no_receipts_found: "Belirtilen kriterlere uygun fiş bulunamadı.",

  pull_to_refresh: "Yenilemek için çekin",
  refreshing: "Yenileniyor...",

  // Receipt Detail Modal
  receipt_info: "Fiş Bilgileri",
  receipt_date: "Fiş Tarihi",
  receipt_time: "Fiş Saati",
  receipt_store: "Mağaza",
  receipt_status: "Durum",
  receipt_status_approved: "Onaylandı",
  receipt_status_pending: "Beklemede",
  receipt_status_rejected: "Reddedildi",
  receipt_images: "Fiş Görselleri",
  bank_details: "Banka Detayları",
  item: "Kalem",
  close: "Kapat",
  pos_details: "POS Detayları",
  bank: "Banka",
  amount: "Tutar",
  bank_name: "Banka Adı",
  expense_details: "Gider Detayları",

  // Store components
  enter_store_name: "Mağaza adını girin",
  enter_location: "Konum bilgisini girin",
  phone_number: "Telefon Numarası",
  enter_phone_number: "Telefon numarasını girin",
  select_address: "Adres seçin",
  store_status: "Mağaza Durumu",
  store_not_found: "Mağaza bulunamadı",
  please_select_store: "Lütfen bir mağaza seçin",
  store_assignment_successful: "Mağaza ataması yapıldı",

  // Form validation
  "validation.store_name_min_length": "Mağaza adı en az 3 karakter olmalıdır",
  "validation.location_min_length": "Konum en az 2 karakter olmalıdır",
  "validation.phone_length": "Telefon numarası 10 haneli olmalıdır",
  "validation.address_min_length": "Adres en az 5 karakter olmalıdır",

  // Para birimleri çevirileri
  tl_200: "200 TL",
  tl_100: "100 TL",
  tl_50: "50 TL",
  tl_20: "20 TL",
  tl_10: "10 TL",
  tl_5: "5 TL",

  // Birimler
  unit_count: "adet",

  // TypeSelector Component
  expense_items: "Gider kalemleri",
  descriptions: "Açıklamalar",
  amounts: "Tutarlar",
  bank_selected_alt: "Banka seçimi",
  money_denominations_alt: "Para birimleri",
  coins_alt: "Bozuk para",
  total_amount_alt: "Toplam tutar",

  // Receipt Create Screen
  receipt_create_error_msg: "Fiş oluşturulurken bir hata oluştu",
  receipt_edit_error_msg: "Fiş güncellenirken bir hata oluştu",
  error_details: "Hata detayı",
  please_try_again: "Lütfen tekrar deneyin",
  reset_warning_message:
    "Fiş tipi seçimine dönerseniz girdiğiniz tüm veriler silinecektir. Devam etmek istiyor musunuz?",
  receipt_created_successfully: "Fiş başarıyla oluşturuldu!",
  receipt_updated_successfully: "Fiş başarıyla güncellendi!",

  images: "Fotoğraflar",

  // Modal Components
  invalid_date: "Geçersiz Tarih",

  // SessionHistory
  hours_abbr: "s",
  minutes_abbr: "d",
  time_expired: "Süre doldu",
  time_remaining: "kaldı",

  // Preview bileşeni
  general_settings: "Genel",
  details_tab: "Detaylar",
  photos_section: "Fotoğraflar",
  changes_tab: "Değişiklikler",
  no_changes_detected: "Henüz değişiklik yapılmadı",
  main_photo: "Ana Fotoğraf",
  photo_singular: "Fotoğraf",
  editing_mode: "Düzenleniyor",
  current_total_amount: "Güncel Toplam Tutar",
  previous_amount: "Önceki",
  save_changes: "Değişiklikleri Kaydet",
  create_receipt: "Fiş Oluştur",
  unknown_type: "Bilinmeyen Tip",
  no_stores_found: "Mağaza bulunamadı",
  active: "Aktif",
  receipts: "Fiş",
  filter_by_activity_type: "Etkinlik tipiyle filtrele",
  summary: "Özet",
  reset_translation: "temizle",

  add: "Ekle",
  submit: "Gönder",

  no_data_available: "Veri bulunmamaktadır",

  // Task translations moved to the unified tasks object above

  my_tasks: "Görevlerim",
  task_management: "Görev Yönetimi",
  create_task: "Görev Oluştur",
  edit_task: "Görevi Düzenle",
  assign_users: "Kullanıcı Ata",
  task_title: "Başlık",
  task_description: "Açıklama",
  task_store: "Mağaza",
  task_due_date: "Bitiş Tarihi",
  task_due_time: "Bitiş Saati",
  task_priority: "Öncelik",
  task_assigned_users: "Atanmış Kullanıcılar",
  task_no_tasks_today: "Bugün için görev bulunmamaktadır.",
  task_no_tasks_history: "Geçmişte görev bulunmamaktadır.",
  task_created_successfully: "Görev başarıyla oluşturuldu.",
  task_updated_successfully: "Görev başarıyla güncellendi.",
  task_deleted_successfully: "Görev başarıyla silindi.",
  task_assigned_successfully: "Kullanıcılar başarıyla atandı.",
  task_submitted_successfully: "Görev başarıyla gönderildi.",
  task_submission_error_context: "Görev gönderilirken bir hata oluştu.",
  task_create_error: "Görev oluşturulurken hata oluştu.",
  task_update_error: "Görev güncellenirken hata oluştu.",
  task_delete_error: "Görev silinirken hata oluştu.",
  task_assignment_error: "Kullanıcı atanırken hata oluştu.",
  task_submit_error: "Görev gönderilirken hata oluştu.",
  task_fetch_my_today_error: "Bugünkü görevleriniz getirilirken hata oluştu.",
  task_fetch_manager_today_error:
    "Yönetici görevleri getirilirken hata oluştu.",
  task_select_store: "Mağaza Seçin",
  task_select_priority: "Öncelik Seçin",
  task_priority_low: "Düşük",
  task_priority_medium: "Orta",
  task_priority_high: "Yüksek",
  task_submit_comment_placeholder: "Yorumlarınızı girin (isteğe bağlı)",
  task_submit_modal_title: "Görevi Gönder",
  task_confirm_delete_title: "Görevi Silmeyi Onayla",
  task_confirm_delete_message:
    '"{{taskTitle}}" başlıklı bu görevi silmek istediğinizden emin misiniz?',
  task_due_time_invalid: "Geçersiz bitiş saati.",
  task_history: "Geçmiş",
  task_today: "Bugün",

  // Manager Tasks Screen
  manager_tasks_title: "Yönetici Görevleri",
  manager_no_tasks_today: "Bugün için görev bulunamadı.",

  // Create Task Screen
  create_task_screen_title: "Yeni Görev Oluştur",

  // Assign Users Bottom Sheet
  assign_users_bottom_sheet_title: "Göreve Kullanıcı Ata",
  assign_users_search_placeholder: "Kullanıcıları ada veya e-postaya göre ara",
  assign_users_no_users_found: "Kullanıcı bulunamadı.",
  assign_users_selected: "{{count}} kullanıcı seçildi",

  // My Tasks Screen
  my_tasks_screen_title: "Görevlerim",

  // Submit Task Modal
  submit_task_modal_header: "Görev İlerlemesini Gönder",
  submit_task_add_comment: "Yorum Ekle",
  submit_task_upload_images: "Resim Yükle",
  submit_task_submit_button: "İlerlemeyi Gönder",

  // ImageUploader
  image_uploader_title: "Resim Yükle",
  select_image_button: "Resim Seç",
  max_files_reached: "Maksimum dosya sayısına ({{maxFiles}}) ulaşıldı.",
  image_preview: "Resim Önizleme",
  remove_image: "Resmi Kaldır",
  file_too_large:
    "{{fileName}} dosyası çok büyük. Maksimum boyut: {{maxFileSizeMB}}MB.",
  permission_denied:
    "Üzgünüz, bunun çalışması için film rulosu izinlerine ihtiyacımız var!",
  failed_to_pick_images: "Resimler seçilemedi.",

  // Device Management
  device_management: "Cihaz Yönetimi",
  my_devices: "Cihazlarım",
  device_requests: "Erişim İstekleri",
  approved_users: "Yetkili Kişiler",
  device_settings: "Cihaz Ayarları",
  add_device: "Cihaz Ekle",
  update_device: "Cihazı Güncelle",
  delete_device: "Cihazı Sil",
  select_device: "Cihaz Seç",
  no_devices_available: "Cihaz bulunamadı",
  add_device_instruction: "Başlamak için yeni bir cihaz kaydedin",
  device_info: "Cihaz Bilgileri",
  current_device: "Aktif Cihaz",
  device_status: "Cihaz Durumu",
  manage_device: "Cihazı Yönet",

  // Device Operations
  connect_as_manager: "Yönetici Olarak Bağlan",
  register_device: "Cihaz Kaydet",
  device_name: "Cihaz Adı",
  device_password: "Cihaz Şifresi",
  confirm_delete_device: "Bu cihazı silmek istediğinizden emin misiniz?",
  device_deleted: "Cihaz başarıyla silindi",
  device_updated: "Cihaz başarıyla güncellendi",
  device_registered: "Cihaz başarıyla kaydedildi",
  device_connected: "Cihaza başarıyla bağlanıldı",

  // Device Requests
  no_pending_requests: "Bekleyen ebeveyn yakını isteği yok",
  pending_requests: "Bekleyen Ebeveyn Yakını İstekleri",
  approve: "Onayla",
  reject: "Reddet",
  request_approved: "Ebeveyn yakını isteği onaylandı",
  request_rejected: "Ebeveyn yakını isteği reddedildi",
  family_request: "Ebeveyn Yakını İsteği",
  send_request: "İstek Gönder",
  request_description:
    "Aşağıdaki kişiler çocuğunuzun ilacını takip etmek istiyor",
  approve_tooltip: "Bu kişiye çocuğunuzun ilaç takibini görme izni verin",
  reject_tooltip: "Bu isteği reddedin",
  family_request_explanation:
    "Ebeveyn yakınlarınız çocuğun ilaç takibini görüntülemek için istek gönderebilir",

  // Device Users
  no_approved_users: "Henüz onaylı ebeveyn yakını yok",
  block_user: "Erişimi Kaldır",
  confirm_block_user:
    "Bu ebeveyn yakınının erişimini kaldırmak istediğinizden emin misiniz?",
  user_blocked: "Ebeveyn yakını erişimi kaldırıldı",
  viewer_role: "Ebeveyn Yakını",
  family_member_role: "Ebeveyn Yakını",
  device_owner: "Ana Ebeveyn",
  approved_family_members: "Onaylı Ebeveyn Yakınları",
  family_members_description:
    "Bu kişiler çocuğunuzun ilaç takibini görüntüleyebilir",
  block_tooltip: "Bu ebeveyn yakınının cihaza erişimini kaldır",

  // Device Errors
  device_error: "Cihaz Hatası",
  connection_failed: "Bağlantı başarısız",
  request_failed: "İstek başarısız",

  // Validation messages
  validation_required: "Bu alan zorunludur.",
  validation_invalid_format: "Geçersiz format.",
  validation_min_length: "En az {{count}} karakter olmalıdır.",
  validation_max_length: "En fazla {{count}} karakter olmalıdır.",
  validation_future_date: "Tarih gelecekte olmalıdır.",

  // ProfileScreen metinleri
  personal_info: "Kişisel Bilgiler",
  full_name: "Ad Soyad",

  // Tema ve görünüm ayarları
  appearance: "Görünüm",
  light_theme: "Açık Tema",
  dark_theme: "Koyu Tema",
  system_theme: "Sistem Teması",
  light: "Açık",
  dark: "Koyu",
  turkish: "Türkçe",
  english: "English",
  notifications: "Bildirimler",

  // Hesap ve cihaz yönetimi
  account: "Hesap",
  session: "Oturum",
  change_password: "Şifre Değiştir",
  privacy_settings: "Gizlilik Ayarları",
  relative_requests: "Yakın İstekleri",
  approved_relatives: "Onaylı Yakınlar",

  // Oturum sonlandırma
  end_parent_session: "Ebeveyn Oturumunu Sonlandır",
  end_device_owner_session: "Cihaz Sahibi Oturumunu Sonlandır",
  logout_confirmation: "Oturumunuzu sonlandırmak istediğinizden emin misiniz?",

  // Roller
  role_admin: "Ebeveyn/Yakın",
  role_manager: "Cihaz Sahibi",
  role_user: "Kullanıcı",

  // Step4Summary metinleri
  medicine_name: "İlaç Adı",
  planned_dose_count: "Planlanan Doz Adedi",
  intake_times: "Alınacak Zamanlar",
  tomorrow: "Yarın",

  // Modal ve uyarı mesajları
  missing_info: "Eksik Bilgi",
  create_valid_plan_message:
    "Lütfen geçerli bir ilaç kullanım planı oluşturun.",
  plan_saved_successfully:
    "{{medicineName}} ilacı için plan başarıyla kaydedildi.",
  save_error: "İlaç planı kaydedilemedi.",

  // Zaman ifadeleri
  and_more_times: "... ve {{count}} zaman daha",
};
