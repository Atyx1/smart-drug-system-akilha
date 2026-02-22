package com.akilha.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.Date;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)// null olmayanları jsona çevir
public class ApiError {

    private int status;
    private String message;
    private String path;
    private long timestamp=new Date().getTime();
    private Map<String,String> validationErrors=null;

    public ApiError(int status, String message, String path) {
        this.status = status;
        this.message = message;
        this.path = path;
    }
}
