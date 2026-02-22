package com.akilha.error;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import java.nio.file.AccessDeniedException;


public class GlobalErrorHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler({DisabledException.class, AccessDeniedException.class})
    ResponseEntity<?> handleDisabledException(Exception exception,HttpServletRequest request){
       var status = exception instanceof DisabledException ? 403 : 401;

        ApiError error = new ApiError(status,exception.getMessage(),request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }


}
