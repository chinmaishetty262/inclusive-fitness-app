package com.example.auth.steps;

import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;


class Response {
    private final int status;
    private final String message;

    public Response(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
}


class AuthService {
    public Response register(String email, String password) {
        return new Response(201, "User registered");
    }

    public Response login(String email, String password) {
        return new Response(200, "User logged in");
    }
}


public class AuthSteps {

    private AuthService authService;
    private Response response;

    private String testEmail;
    private String testPassword;

    @Before
    public void setup() {
        authService = mock(AuthService.class);
    }

    
    @Given("user provides valid registration details with email {string} and password {string}")
    public void givenUserProvidesDetails(String email, String password) {
    this.testEmail = email;
    this.testPassword = password;

    
    if (!email.equals("testemail_existing")) {
        when(authService.register(email, password))
                .thenReturn(new Response(201, "User registered"));
    }
    }

// Negative registration (email already exists)
    @Given("user provides registration details with email {string} and password {string} for existing user")
    public void givenUserProvidesDetailsForExisting(String email, String password) {
    this.testEmail = email;
    this.testPassword = password;

        when(authService.register(email, password))
            .thenReturn(new Response(409, "Email already exists"));
    }


    @When("user sends POST request to {string}")
    public void whenUserSendsPostRequest(String endpoint) {
        if (endpoint.equals("/register")) {
            response = authService.register(testEmail, testPassword);
        }
    }

    @Then("registration should be successful")
    public void thenRegistrationShouldBeSuccessful() {
        assertEquals(201, response.getStatus());
        assertEquals("User registered", response.getMessage());
    }

    @Then("registration should fail")
    public void thenRegistrationShouldFail() {
        assertEquals(409, response.getStatus());
        assertEquals("Email already exists", response.getMessage());
    }

    
    @Given("user is already registered with email {string} and password {string}")
    public void givenUserIsAlreadyRegistered(String email, String password) {
        this.testEmail = email;
        this.testPassword = password;

        // Positive login
        when(authService.login(email, password))
                .thenReturn(new Response(200, "User logged in"));

        // Negative login: wrong password or email
        when(authService.login(eq(email), eq("wrongpass")))
                .thenReturn(new Response(401, "Invalid email or password"));
    }

    @When("user sends POST request to {string} with valid credentials")
    public void whenUserLogsInWithValidCredentials(String endpoint) {
        if (endpoint.equals("/login")) {
            response = authService.login(testEmail, testPassword);
        }
    }

    @When("user sends POST request to {string} with email {string} and wrong password {string}")
    public void whenUserLogsInWithWrongCredentials(String endpoint, String email, String password) {
        if (endpoint.equals("/login")) {
            response = authService.login(email, password);
        }
    }

    @Then("login should be successful")
    public void thenLoginShouldBeSuccessful() {
        assertEquals(200, response.getStatus());
        assertEquals("User logged in", response.getMessage());
    }

    @Then("login should fail")
    public void thenLoginShouldFail() {
        assertEquals(401, response.getStatus());
        assertEquals("Invalid email or password", response.getMessage());
    }

    
        
}