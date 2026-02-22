package com.akilha.email;



import org.springframework.stereotype.Component;

@Component
public class StaticTemplates {

    /**
     * Aktivasyon başarılı sayfası
     */
    public String getActivationSuccessTemplate() {
        return """
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hesap Aktivasyonu Başarılı</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                
                .container {
                    background: #ffffff;
                    padding: 50px 40px;
                    border-radius: 25px;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
                    text-align: center;
                    max-width: 500px;
                    width: 90%;
                    border: 1px solid #e2e8f0;
                    position: relative;
                    overflow: hidden;
                }
                
                .container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
                    background-size: 200% 100%;
                    animation: shimmer 3s infinite;
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .success-icon {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    box-shadow: 0 15px 35px rgba(72, 187, 120, 0.3);
                    animation: bounce 2s infinite;
                }
                
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }
                
                .success-icon svg {
                    width: 50px;
                    height: 50px;
                    fill: white;
                }
                
                h1 {
                    color: #2d3748;
                    font-size: 32px;
                    margin-bottom: 20px;
                    font-weight: 300;
                    letter-spacing: 1px;
                }
                
                p {
                    color: #4a5568;
                    font-size: 18px;
                    line-height: 1.8;
                    margin-bottom: 40px;
                    padding: 0 10px;
                }
                
                .home-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 18px 40px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 16px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    transition: all 0.4s ease;
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                    position: relative;
                    overflow: hidden;
                }
                
                .home-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }
                
                .home-button:hover::before {
                    left: 100%;
                }
                
                .home-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
                    color: white;
                }
                
                .footer {
                    margin-top: 50px;
                    color: #718096;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                @media (max-width: 480px) {
                    .container {
                        padding: 40px 30px;
                        border-radius: 20px;
                    }
                    
                    h1 {
                        font-size: 28px;
                    }
                    
                    p {
                        font-size: 16px;
                    }
                    
                    .home-button {
                        padding: 15px 30px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
                
                <h1>Hesabınız Başarıyla Aktive Edildi!</h1>
                
                <p>
                    Akilha platformuna hoş geldiniz! Hesabınız başarıyla aktive edildi. 
                    Artık tüm özellikleri kullanmaya başlayabilirsiniz.
                </p>
                
                   <a href="/api/v1/users/home" class="home-button">Ana Sayfaya Git</a>
                
                <div class="footer">
                    © 2025 Akilha - Tüm hakları saklıdır.
                </div>
            </div>
        </body>
        </html>
        """;
    }

    /**
     * Aktivasyon başarısız sayfası
     */
    public String getActivationErrorTemplate() {
        return """
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aktivasyon Hatası</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #1B1A55 0%, #535C91 100%);
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    text-align: center;
                    max-width: 500px;
                    width: 90%;
                }
                
                .error-icon {
                    width: 80px;
                    height: 80px;
                    background: #f44336;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                
                .error-icon svg {
                    width: 40px;
                    height: 40px;
                    fill: white;
                }
                
                h1 {
                    color: #1B1A55;
                    font-size: 28px;
                    margin-bottom: 15px;
                }
                
                p {
                    color: #666;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                
                .retry-button {
                    display: inline-block;
                    background: #1B1A55;
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .retry-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(27, 26, 85, 0.3);
                }
                
                .contact-support {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #888;
                }
                
                .contact-support a {
                    color: #1B1A55;
                    text-decoration: none;
                    font-weight: 600;
                }
                
                .footer {
                    margin-top: 40px;
                    color: #888;
                    font-size: 14px;
                }
                
                @media (max-width: 480px) {
                    .container {
                        padding: 30px 20px;
                    }
                    
                    h1 {
                        font-size: 24px;
                    }
                    
                    p {
                        font-size: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                    </svg>
                </div>
                
                <h1>Aktivasyon Başarısız</h1>
                
                <p>
                     Hesabınızı aktif olduğundan dolayı veya
                    Aktivasyon kodunuzun geçersiz olmasından veya 
                    süresinin dolmasından dolayı hesabınız aktive edilemedi.
                </p>
                
     
                
                <div class="contact-support">
                    Sorun devam ederse, <a href="mailto:support@akilha.com">destek ekibimizle</a> iletişime geçin.
                </div>
                
                <div class="footer">
                    © 2025 Akilha - Tüm hakları saklıdır.
                </div>
            </div>
        </body>
        </html>
        """;
    }


    /**
     * Şifre sıfırlama başarılı sayfası
     */
    public String getPasswordResetSuccessTemplate() {
        return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Şifre Güncellendi</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1B1A55 0%, #535C91 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .success-container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                text-align: center;
                max-width: 450px;
                width: 90%;
            }
            
            .success-icon {
                width: 80px;
                height: 80px;
                background: #4CAF50;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
            }
            
            .success-icon svg {
                width: 40px;
                height: 40px;
                fill: white;
            }
            
            h1 {
                color: #1B1A55;
                font-size: 28px;
                margin-bottom: 15px;
            }
            
            p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            
            .redirect-message {
                color: #888;
                font-size: 14px;
            }
            
            #countdown {
                font-weight: bold;
                color: #1B1A55;
            }
            
            @media (max-width: 480px) {
                .success-container {
                    padding: 30px 20px;
                }
                
                h1 {
                    font-size: 24px;
                }
                
                p {
                    font-size: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="success-container">
            <div class="success-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
            </div>
            <h1>Şifreniz Başarıyla Güncellendi!</h1>
            <p>Yeni şifrenizle giriş yapabilirsiniz.</p>
            <div class="redirect-message">
                <span id="countdown">5</span> saniye içinde yönlendiriliyorsunuz...
            </div>
        </div>
        
                <script>
                    let count = 5;
                    const countdown = setInterval(() => {
                        count--;
                        document.getElementById('countdown').textContent = count;
                        if (count === 0) {
                            clearInterval(countdown);
                            window.location.href = '/api/v1/users/home';
                        }
                    }, 1000);
                </script>
    </body>
    </html>
    """;
    }


    /**
     * Şifre sıfırlama hata sayfası
     */
    public String getPasswordResetErrorTemplate() {
        return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Şifre Sıfırlama Hatası</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1B1A55 0%, #535C91 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .error-container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                text-align: center;
                max-width: 450px;
                width: 90%;
            }
            
            .error-icon {
                width: 80px;
                height: 80px;
                background: #f44336;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
            }
            
            .error-icon svg {
                width: 40px;
                height: 40px;
                fill: white;
            }
            
            h1 {
                color: #1B1A55;
                font-size: 28px;
                margin-bottom: 15px;
            }
            
            p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            
            .retry-button {
                display: inline-block;
                background: #1B1A55;
                color: white;
                padding: 12px 30px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                margin-bottom: 20px;
            }
            
            .retry-button:hover {
                background: #535C91;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(27, 26, 85, 0.3);
            }
            
            .contact-support {
                color: #666;
                font-size: 14px;
            }
            
            .contact-support a {
                color: #1B1A55;
                text-decoration: none;
                font-weight: 600;
            }
            
            @media (max-width: 480px) {
                .error-container {
                    padding: 30px 20px;
                }
                
                h1 {
                    font-size: 24px;
                }
                
                p {
                    font-size: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
            </div>
            <h1>Şifre Sıfırlama Hatası</h1>
            <p>
                Üzgünüz, şifre sıfırlama bağlantınız geçersiz veya süresi dolmuş. 
                Güvenliğiniz için şifre sıfırlama bağlantıları sınırlı bir süre geçerlidir.
            </p>
        
            <div class="contact-support">
                Sorun devam ederse, <a href="mailto:support@akilha.com">destek ekibimizle</a> iletişime geçin.
            </div>
        </div>
    </body>
    </html>
    """;




    }


    /**
     * Şifre sıfırlama başarısız sayfası
     */
    public String getPasswordResetFailTemplate() {
        return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Şifre Güncelleme Hatası</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1B1A55 0%, #535C91 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .error-container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                text-align: center;
                max-width: 450px;
                width: 90%;
            }
            
            .error-icon {
                width: 80px;
                height: 80px;
                background: #f44336;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
            }
            
            .error-icon svg {
                width: 40px;
                height: 40px;
                fill: white;
            }
            
            h1 {
                color: #1B1A55;
                font-size: 28px;
                margin-bottom: 15px;
            }
            
            p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            
            .redirect-message {
                color: #888;
                font-size: 14px;
            }
            
            #countdown {
                font-weight: bold;
                color: #1B1A55;
            }
            
            @media (max-width: 480px) {
                .error-container {
                    padding: 30px 20px;
                }
                
                h1 {
                    font-size: 24px;
                }
                
                p {
                    font-size: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
            </div>
            <h1>Şifre Güncelleme Başarısız</h1>
            <p>Üzgünüz, şifreniz güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
            <div class="redirect-message">
                <span id="countdown">5</span> saniye içinde ana sayfaya yönlendiriliyorsunuz...
            </div>
        </div>
        
        <script>
            let count = 5;
            const countdown = setInterval(() => {
                count--;
                document.getElementById('countdown').textContent = count;
                if (count === 0) {
                    clearInterval(countdown);
                    window.location.href = '${homeUrl}';
                }
            }, 1000);
        </script>
    </body>
    </html>
    """;
    }


    /**
     * Sayfa bulunamadı sayfası
     */
    public String getNotFoundTemplate() {
        return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sayfa Bulunamadı</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
              .logo {
                                        width: 120px;
                                        height: 120px;
                                        margin: 0 auto 30px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        border-radius: 50%;
                                        overflow: hidden; /* Taşan kısımları gizle */
                                        background: transparent;
                                    }
                                   \s
                                    .logo img {
                                        width: 100%;
                                        height: 100%;
                                        object-fit: contain; /* Resmi orantılı şekilde sığdır */
                                        border-radius: 50%;
                                    }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #1B1A55 0%, #535C91 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .error-container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                text-align: center;
                max-width: 450px;
                width: 90%;
            }
            
            .error-icon {
                width: 120px;
                height: 120px;
                margin: 0 auto 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: #f8f9fa;
            }
            
            .error-icon img {
                width: 80%;
                height: 80%;
                object-fit: contain;
                border-radius: 50%;
            }
            
            h1 {
                color: #1B1A55;
                font-size: 28px;
                margin-bottom: 15px;
            }
            
            p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            
            .home-button {
                display: inline-block;
                background: #1B1A55;
                color: white;
                padding: 12px 30px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .home-button:hover {
                background: #535C91;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(27, 26, 85, 0.3);
            }
            
            .redirect-message {
                margin-top: 20px;
                color: #888;
                font-size: 14px;
            }
            
            #countdown {
                font-weight: bold;
                color: #1B1A55;
            }
            
            @media (max-width: 480px) {
                .error-container {
                    padding: 30px 20px;
                }
                
                h1 {
                    font-size: 24px;
                }
                
                p {
                    font-size: 15px;
                }
                
                .error-icon {
                    width: 100px;
                    height: 100px;
                }
                
                    .logo {
                                                width: 100px;
                                                height: 100px;
                                            }
            }
        </style>
    </head>
    <body>
        <div class="error-container">
              <div class="logo">
                              <img src="https://drive.google.com/uc?export=view&id=14wAGZQpXLOt20jPXBsHGOXWJeh917Dl9" alt="Akilha">
                          </div>
            
            <h1>Sayfa Bulunamadı</h1>
            
            <p>
                Aradığınız sayfa bulunamadı veya taşınmış olabilir. 
                Ana sayfaya yönlendiriliyorsunuz.
            </p>
            
            <a href="${homeUrl}" class="home-button">Ana Sayfaya Git</a>
            
            <div class="redirect-message">
                <span id="countdown">5</span> saniye içinde yönlendiriliyorsunuz...
            </div>
        </div>
        
      <script>
                                 let count = 5;
                                 const countdown = setInterval(() => {
                                     count--;
                                     document.getElementById('countdown').textContent = count;
                                     if (count === 0) {
                                         clearInterval(countdown);
                                         window.location.href = '/api/v1/users/home';
                                     }
                                 }, 1000);
                             </script>
    </body>
    </html>
    """;
    }


    /**
     * Ana sayfa şablonu
     *
     */
    public String getHomePageTemplate() {
        return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Akilha</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            :root {
                --primary-color: #1B1A55;
                --secondary-color: #535C91;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 40px 20px;
            }
            
            .container {
                max-width: 800px;
                width: 90%;
                background: #ffffff;
                border-radius: 25px;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.08);
                overflow: hidden;
                margin: 20px;
                border: 1px solid #e2e8f0;
                position: relative;
            }
            
            .logo-section {
                background: white;
                padding: 40px;
                text-align: center;
                border-bottom: 1px solid #eee;
            }
            
            .logo {
                width: 150px;
                height: 150px;
                margin: 0 auto 20px;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .logo img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .content {
                padding: 40px;
                text-align: center;
            }
            
            h1 {
                color: #2d3748;
                font-size: 2.5em;
                margin-bottom: 20px;
                font-weight: 300;
                letter-spacing: 2px;
            }
            
            .description {
                color: #4a5568;
                font-size: 1.2em;
                line-height: 1.8;
                margin-bottom: 30px;
                padding: 0 20px;
            }
            
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 15px;
                margin: 20px 0;
            }
            
            .feature {
                text-align: center;
                padding: 20px;
            }
            
            .feature-icon {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                color: white;
                font-size: 28px;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                transition: transform 0.3s ease;
            }
            
            .feature:hover .feature-icon {
                transform: translateY(-5px);
            }
            
            .feature h3 {
                color: #2d3748;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .feature p {
                color: #4a5568;
                font-size: 0.9em;
                line-height: 1.6;
            }
            
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #eee;
            }
            
            .copyright {
                color: #718096;
                font-size: 0.9em;
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .container {
                    width: 95%;
                }
                
                h1 {
                    font-size: 2em;
                }
                
                .logo {
                    width: 120px;
                    height: 120px;
                }
                
                .content {
                    padding: 30px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo-section">
                <div class="logo">
                    <img src="https://drive.google.com/uc?export=view&id=14wAGZQpXLOt20jPXBsHGOXWJeh917Dl9" alt="Akilha">
                </div>
            </div>
            
            <div class="content">
                <h1>Akilha</h1>
                <p class="description">
                    Akıllı ve modern çözümlerle hayatınızı kolaylaştıran platform. Teknoloji, inovasyon ve kullanıcı deneyimi...
                </p>
                
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon">🚀</div>
                        <h3>İnovatif Çözümler</h3>
                        <p>Akıllı teknoloji çözümleri</p>
                    </div>
                    
                    <div class="feature">
                        <div class="feature-icon">⚡</div>
                        <h3>Hızlı Performans</h3>
                        <p>Optimum hız ve verimlilik</p>
                    </div>
                    
                    <div class="feature">
                        <div class="feature-icon">💫</div>
                        <h3>7/24 Destek</h3>
                        <p>Her zaman yanınızdayız</p>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p class="copyright">© 2025 Akilha - Tüm hakları saklıdır.</p>
            </div>
        </div>
    </body>
    </html>
    """;
    }
}