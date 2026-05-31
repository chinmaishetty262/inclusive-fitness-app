Feature: Workout guides route
  As a client of the activity tracking API
  I want to fetch workout guides
  So that the frontend can display appropriate exercises per accessibility category

  Scenario: Fetching all workout guides
    Given the database contains workout guides across multiple categories
    When the client requests all workout guides
    Then the API returns all guides

  Scenario: Fetching workout guides filtered by category
    Given the database contains workout guides across multiple categories
    When the client requests guides for the wheelchair category
    Then the API returns only wheelchair guides

  Scenario: Fetching guides when none match the requested category
    Given the database contains no guides for the requested category
    When the client requests guides for the wheelchair category
    Then the API returns an empty list

  Scenario: Handling a database error when fetching guides
    Given the database throws an error when queried
    When the client requests all workout guides
    Then the API responds with a server error
