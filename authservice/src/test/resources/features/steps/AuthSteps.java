package com.example.authservice.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AuthSteps {

    private final RestTemplate restTemplate = new RestTemplate();
    private ResponseEntity<String> response;
    private final String baseUrl = "http://localhost:8080";

    // Step for registration input
    @Given("user provides valid registration details")
    public void userProvidesValidRegistrationDetails() {
        // You can add dynamic test data here if needed
    }

    // Step for sending POST requests
    @When("user sends POST request to {string}")
    public void userSendsPostRequest(String endpoint) {
        String url = baseUrl + endpoint;

        // JSON body for both register/login
        String requestBody = """
            {
              "username": "testuser",
              "password": "test123"
            }
            """;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                String.class
        );
    }

    // Step for ensuring user is already registered
    @Given("user is already registered")
    public void userIsAlreadyRegistered() {
        String url = baseUrl + "/register";

        String requestBody = """
            {
              "username": "testuser",
              "password": "test123"
            }
            """;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // Ignore response; just register user
        restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    }

    // Step for asserting response code
    @Then("response status should be {int}")
    public void responseStatusShouldBe(int statusCode) {
        assertEquals(statusCode, response.getStatusCode().value());
    }
}