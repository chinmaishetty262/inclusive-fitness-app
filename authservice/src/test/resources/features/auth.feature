Feature: User Authentication

  Scenario: User Registration
    Given user provides valid registration details
    When user sends POST request to "/register"
    Then user should be registered successfully
    And response status should be 201

  Scenario: User Login
    Given user is already registered
    When user sends POST request to "/login" with valid credentials
    Then user should receive authentication token
    And response status should be 200