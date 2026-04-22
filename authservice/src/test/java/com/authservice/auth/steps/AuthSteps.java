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
    public Response register(String username, String password) {
        return new Response(201, "User registered");
    }

    public Response login(String username, String password) {
        return new Response(200, "User logged in");
    }
}


public class AuthSteps {

    private AuthService authService;
    private Response response;

    private String testUsername;
    private String testPassword;

    @Before
    public void setup() {
        authService = mock(AuthService.class);
    }

    
    @Given("user provides valid registration details with username {string} and password {string}")
    public void givenUserProvidesDetails(String username, String password) {
    this.testUsername = username;
    this.testPassword = password;

    
    if (!username.equals("testuser_existing")) {
        when(authService.register(username, password))
                .thenReturn(new Response(201, "User registered"));
    }
    }

// Negative registration (username already exists)
    @Given("user provides registration details with username {string} and password {string} for existing user")
    public void givenUserProvidesDetailsForExisting(String username, String password) {
    this.testUsername = username;
    this.testPassword = password;

        when(authService.register(username, password))
            .thenReturn(new Response(409, "Username already exists"));
    }


    @When("user sends POST request to {string}")
    public void whenUserSendsPostRequest(String endpoint) {
        if (endpoint.equals("/register")) {
            response = authService.register(testUsername, testPassword);
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
        assertEquals("Username already exists", response.getMessage());
    }

    
    @Given("user is already registered with username {string} and password {string}")
    public void givenUserIsAlreadyRegistered(String username, String password) {
        this.testUsername = username;
        this.testPassword = password;

        // Positive login
        when(authService.login(username, password))
                .thenReturn(new Response(200, "User logged in"));

        // Negative login: wrong password or username
        when(authService.login(eq(username), eq("wrongpass")))
                .thenReturn(new Response(401, "Invalid username or password"));
    }

    @When("user sends POST request to {string} with valid credentials")
    public void whenUserLogsInWithValidCredentials(String endpoint) {
        if (endpoint.equals("/login")) {
            response = authService.login(testUsername, testPassword);
        }
    }

    @When("user sends POST request to {string} with username {string} and wrong password {string}")
    public void whenUserLogsInWithWrongCredentials(String endpoint, String username, String password) {
        if (endpoint.equals("/login")) {
            response = authService.login(username, password);
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
        assertEquals("Invalid username or password", response.getMessage());
    }

    
        
}