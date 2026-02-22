package com.akilha.configuration.properties;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "trend")
@Configuration
@Getter
@Setter
public class BackendProperties {


    private Email email;

    private Client client;

    private  String tokenType;

    private Domain domain;

    public  static record  Email(
            String from,
            String host,
            int port,
            String username,
            String password
    ) {
    }


    public  static record  Client(
            String host
    ) {
    }

    public  static record  Domain(
            String url
    ) {
    }

}
