package com.akilha.device.dto;

import lombok.Data;

@Data
public class DeviceResponse {
    private Long id;
    private String name;
    private boolean manager;
}