Feature: Activity feed
  As a signed-in user
  I want to see my recent activities
  So that I can review what I logged

  Scenario: Showing the current user's recent activities
    Given the activity service returns recent activities for the current user
    When the activity feed is opened for that user
    Then the feed lists the user's activity details

  Scenario: Showing an error when the feed cannot be loaded
    Given the activity service request fails
    When the activity feed is opened for that user
    Then the feed shows an activity load error

  Scenario: Showing an empty feed when the user has no activities
    Given the activity service returns no activities for the current user
    When the activity feed is opened for that user
    Then the feed shows that no recent activities are available
