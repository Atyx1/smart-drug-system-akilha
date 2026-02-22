package com.akilha.device.dto;


import lombok.Data;

@Data
public class DeviceRegisterRequest {
    private String name;
    private String password;
}