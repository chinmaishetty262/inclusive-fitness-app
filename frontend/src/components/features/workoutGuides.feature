Feature: Workout guides
  As a signed-in user
  I want to browse workout guides tailored to my accessibility needs
  So that I can find suitable exercises to follow

  Scenario: Showing guides for the default category on load
    Given the workout guides service returns guides for the general category
    When the workout guides page is opened
    Then the guides for the general category are displayed

  Scenario: Switching to a different accessibility category
    Given the workout guides service returns guides for the general category
    And the workout guides service returns guides for the wheelchair category
    When the workout guides page is opened
    And the user selects the wheelchair category
    Then the guides for the wheelchair category are displayed

  Scenario: Expanding a workout card to see its steps
    Given the workout guides service returns a guide with steps
    When the workout guides page is opened
    And the user expands the first workout card
    Then the workout steps are shown

  Scenario: Showing an error when guides cannot be loaded
    Given the workout guides service request fails
    When the workout guides page is opened
    Then the workout guides page shows a load error
