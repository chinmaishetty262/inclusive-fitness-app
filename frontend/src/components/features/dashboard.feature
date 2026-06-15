Feature: Dashboard page
  As a signed-in user
  I want to see my dashboard summary and quick actions
  So that I can review my recent activity at a glance

  Scenario: Showing the dashboard summary and action button
    Given the statistics service returns totals for the current user
    And the activity service returns recent activities for the current user
    When the dashboard is opened for that user
    Then the dashboard shows activity summary bubbles
    And the dashboard shows the track activity button

  Scenario: Navigating to the track exercise page from the dashboard
    Given the statistics and activity services are available for the current user
    When the user clicks the track activity button
    Then navigation to the track exercise page occurs
