package com.akilha.email;




import org.springframework.stereotype.Component;

@Component
public class EmailTemplates {



    private static final String LOGO_URL = "https://drive.google.com/uc?export=view&id=14wAGZQpXLOt20jPXBsHGOXWJeh917Dl9";



    private static final String COMMON_STYLES = """
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
            color: #2d3748;
            line-height: 1.6;
            padding: 40px 20px;
        }
        
        .container {
            background: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
        }
        
        .header {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            color: #2d3748;
            text-align: center;
            padding: 40px 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .logo {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
            background: #ffffff;
            border-radius: 50%;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 3px solid #f8fafc;
        }
        
        .logo img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: contain;
        }
        
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 300;
            color: #1a202c;
            letter-spacing: 2px;
        }
        
        .content {
            padding: 50px 40px;
            text-align: center;
            background: #ffffff;
        }
        
        .date-text {
            font-size: 14px;
            color: #718096;
            margin-bottom: 30px;
            font-weight: 500;
        }
        
        .content p {
            font-size: 18px;
            margin-bottom: 25px;
            color: #4a5568;
            line-height: 1.8;
        }
        
        .content strong {
            color: #2d3748;
            font-weight: 600;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 18px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            margin: 30px 0;
            transition: all 0.4s ease;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            letter-spacing: 1px;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
        }
        
        .button:before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .button:hover:before {
            left: 100%;
        }
        
        .button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
            color: #ffffff;
        }
        
        .security-note {
            background: #f7fafc;
            border-left: 4px solid #4299e1;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 10px 10px 0;
            font-size: 14px;
            color: #2d3748;
            text-align: left;
        }
        
        .footer {
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            color: #718096;
            text-align: center;
            padding: 30px;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
            margin: 0;
            font-size: 14px;
            font-weight: 500;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 20px 10px;
            }
            
            .container {
                border-radius: 15px;
            }
            
            .content {
                padding: 30px 25px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .button {
                padding: 15px 30px;
                font-size: 14px;
            }
        }
    """;

    /**
     * Hesap aktivasyonu e-posta şablonu
     *
     */
    public String getActivationEmailTemplate() {
        return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hesap Aktivasyonu</title>
        <style>
            %s
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="%s" alt="Akilha">
                </div>
                <h1>AKILHA</h1>
            </div>
            
            <div class="content">
                <p class="date-text">${date}</p>
                <p><strong>Merhaba, ${fullName}!</strong></p>
                <p>Akilha platformuna hoş geldiniz! Hesabınızı etkinleştirmek ve tüm özelliklerden yararlanmak için aşağıdaki butona tıklayın.</p>
                <a href="${activationLink}" class="button">Hesabı Etkinleştir</a>
                
                <div class="security-note">
                    <strong>🔒 Güvenlik Notu:</strong><br>
                    Bu aktivasyon linki sadece sizin için oluşturulmuştur. Güvenliğiniz için bu e-postayı kimseyle paylaşmayın.
                </div>
            </div>
            
            <div class="footer">
                <p>© 2025 Akilha - Tüm hakları saklıdır.</p>
            </div>
        </div>
    </body>
    </html>
    """.formatted(COMMON_STYLES, LOGO_URL);
    }

    /**
     * Şifre sıfırlama e-posta şablonu
     */
    public String getPasswordResetEmailTemplate() {
        return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Şifre Sıfırlama</title>
        <style>
            %s
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="%s" alt="Akilha">
                </div>
                <h1>AKILHA</h1>
            </div>
            
            <div class="content">
                <p class="date-text">${date}</p>
                <p><strong>Merhaba, ${fullName}!</strong></p>
                <p>Şifrenizi sıfırlamak için bir talepte bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.</p>
                <a href="${passwordResetLink}" class="button">Şifreyi Sıfırla</a>
                
                <div class="security-note">
                    <strong>⏱️ Önemli Bilgi:</strong><br>
                    Bu link 1 saat boyunca geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                </div>
            </div>
            
            <div class="footer">
                <p>© 2025 Akilha - Tüm hakları saklıdır.</p>
            </div>
        </div>
    </body>
    </html>
    """.formatted(COMMON_STYLES, LOGO_URL);
    }
}