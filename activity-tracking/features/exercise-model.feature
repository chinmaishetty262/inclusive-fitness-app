Feature: Exercise model validation
  As the activity tracking service
  I want exercise documents to be validated
  So that invalid activity data is rejected

  Scenario: Accepting a valid exercise with optional metrics
    Given a valid exercise document with distance and steps
    When the exercise document is validated
    Then the document is accepted

  Scenario: Rejecting an exercise with non-integer steps
    Given an exercise document with decimal steps
    When the exercise document is validated
    Then the document reports that steps must be an integer

  Scenario: Rejecting an exercise with an unsupported type
    Given an exercise document with an unsupported exercise type
    When the exercise document is validated
    Then the document reports that the exercise type is invalid

  Scenario: Rejecting an exercise with a non-positive duration
    Given an exercise document with a non-positive duration
    When the exercise document is validated
    Then the document reports that the duration must be positive
