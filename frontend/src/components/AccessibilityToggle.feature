Feature: Accessibility high-contrast toggle

    As a user with low vision or light sensitivity
    I want to switch the app to high-contrast mode
    So that I can comfortably read and use the app without eye strain

    Background:
        Given I have the MLA Fitness App open in my browser

    Scenario: Toggle is visible on the login page
        Given I am on the login page
        Then I should see a high-contrast toggle in the bottom-left corner of the screen

    Scenario: Toggle is visible after logging in
        Given I am logged in
        When I navigate to any page
        Then I should see the high-contrast toggle in the bottom-left corner

    Scenario: Activating high-contrast mode
        Given the app is in standard mode
        When I click the high-contrast toggle
        Then the toggle switch should move to the right
        And the page background should change to black
        And the text should change to white
        And the navbar should change to dark

    Scenario: Deactivating high-contrast mode
        Given the app is in high-contrast mode
        When I click the high-contrast toggle
        Then the toggle switch should move to the left
        And the page background should return to white
        And the text should return to the standard dark colour

    Scenario: Preference is saved across page refreshes
        Given I have activated high-contrast mode
        When I refresh the browser
        Then the app should still be in high-contrast mode
        And the toggle should still be in the active position

    Scenario: Preference is saved when navigating between pages
        Given I have activated high-contrast mode
        And I am logged in
        When I navigate to the Activities Summary page
        Then the app should still be in high-contrast mode
        When I navigate to the Weekly Journal page
        Then the app should still be in high-contrast mode

