Feature: Analytics endpoints
  As a dashboard client
  I want analytics endpoints to aggregate and validate activity data
  So that the statistics views receive predictable responses

  Scenario: Returning aggregated totals for all users
    Given the analytics database returns aggregated totals
    When the client requests all statistics
    Then the analytics response includes those totals

  Scenario: Rejecting an invalid weekly date range
    Given an analytics client
    When the client requests weekly statistics with an invalid start date
    Then the analytics response reports an invalid date format

  Scenario: Returning stats for a selected user
    Given the analytics database returns user totals for a selected user
    When the client requests statistics for that user
    Then the analytics response only includes the selected user totals

  Scenario: Returning weekly stats for a selected range
    Given the analytics database returns weekly totals for the selected range
    When the client requests weekly statistics for a valid date range
    Then the analytics response includes the weekly totals
