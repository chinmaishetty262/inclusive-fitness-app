Feature: Statistics summary
  As a signed-in user
  I want to see my aggregated exercise totals
  So that I can understand my activity summary and totals by exercise type

  Scenario: Showing summary totals for the current user
    Given the statistics service returns totals for the current user
    When the statistics summary is opened for that user
    Then the summary bubbles show the combined totals
    And the activity totals section shows each exercise type

  Scenario: Showing fallback totals for missing values
    Given the statistics service returns activity totals with missing distance or steps values
    When the statistics summary is opened for that user
    Then missing activity totals are shown as zero

  Scenario: Showing an error when statistics cannot be loaded
    Given the statistics service request fails
    When the statistics summary is opened for that user
    Then the statistics view shows a load error

  Scenario: Showing no activity totals when none exist
    Given the statistics service returns no exercise totals for the current user
    When the statistics summary is opened for that user
    Then the statistics view shows that no activity type totals are available

  Scenario: Updating statistics when the selected user changes
    Given the statistics service returns totals for the first user and then for a second user
    When the statistics summary is opened for the first user and then updated for the second user
    Then the summary bubbles update to reflect the second user's totals
