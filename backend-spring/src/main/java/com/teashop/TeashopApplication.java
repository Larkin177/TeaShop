package com.teashop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TeashopApplication {
    public static void main(String[] args) {
        SpringApplication.run(TeashopApplication.class, args);
        System.out.println("╔══════════════════════════════════╗");
        System.out.println("║  TeaShop Backend is running!     ║");
        System.out.println("║  http://localhost:3001            ║");
        System.out.println("║  Swagger: http://localhost:3001   ║");
        System.out.println("╚══════════════════════════════════╝");
    }
}
