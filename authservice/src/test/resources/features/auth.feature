Feature: User Authentication


  Scenario: User Registration
    Given user provides valid registration details with username "testuser" and password "test123" 
    When user sends POST request to "/register"
    Then registration should be successful

  Scenario: User Login
    Given user is already registered with username "testuser" and password "test123"
    When user sends POST request to "/login" with valid credentials
    Then login should be successful
  
  Scenario: User Registration with existing username
    Given user provides registration details with username "testuser_existing" and password "test123" for existing user
    When user sends POST request to "/register"
    Then registration should fail

  Scenario: User Login with wrong credentials
    Given user is already registered with username "testuser" and password "test123"
    When user sends POST request to "/login" with username "testuser" and wrong password "wrongpass"
    Then login should fail
   

  