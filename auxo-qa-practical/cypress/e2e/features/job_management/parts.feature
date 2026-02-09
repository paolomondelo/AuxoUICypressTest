Feature: Parts Management

  Background:
    Given I navigate to the Parts List page

  @parts @smoke @regression
  Scenario: Merge two parts successfully
    When I click the New Part button on the Parts List
    And I create parts info for Parts A and submit it
    And I create parts info for Parts B and submit it
    And I merge parts A and parts B
    And I should see a warning message that parts B will be deleted
    And I confirm the deletion of parts B
    Then I should see "Parts merged successfully." message

  @parts @regression
  Scenario: Validate parts history after merge
    When I click the New Part button on the Parts List
    And I create parts info for Parts A and submit it
    And I create parts info for Parts B and submit it
    And I merge parts A and parts B
    And I should see a warning message that parts B will be deleted
    And I confirm the deletion of parts B
    Then I should see "Parts merged successfully." message
    And I click the newly merged part on the Parts List
    And I validate the parts history of the merged part and the recorded fields should be existing
