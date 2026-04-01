Feature: Exercise routes
  As a client of the activity tracking API
  I want exercise requests to validate and transform payloads
  So that stored data stays consistent

  Scenario: Creating an exercise converts numeric fields
    Given a valid exercise payload with numeric values as strings
    When the client creates the exercise
    Then the API stores the numeric fields as numbers
    And the API returns a success message

  Scenario: Updating an exercise with missing required fields
    Given an incomplete update payload
    When the client updates an exercise
    Then the API responds that all fields are required

  Scenario: Deleting an exercise that does not exist
    Given the requested exercise does not exist
    When the client deletes the exercise
    Then the API responds that the exercise was not found
