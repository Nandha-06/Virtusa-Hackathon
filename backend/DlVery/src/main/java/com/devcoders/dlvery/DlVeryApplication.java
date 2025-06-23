package com.devcoders.dlvery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class DlVeryApplication {

    public static void main(String[] args) {
        SpringApplication.run(DlVeryApplication.class, args);
    }

}
