package com.umc._4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.umc")public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}

