package com.autocareconnect.backend;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SignupController {

	@PostMapping("/api/signup")
	public String signUp() {
		return "hello";
	}
}
