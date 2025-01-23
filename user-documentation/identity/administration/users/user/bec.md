---
description: Single pane of glass review of common Indicators of Compromise (IoC)
---

# Compromise Remediation

Upon page load, CIPP will run an analysis on the user to identify common Indicators of Compromise (IoC). Once that analysis is returned, review the information presented and determine if the user has been compromised. The analysis performs the checks listed in the table below. A green check will indicate that information was found for the check and needs review.

### Indicators of Compromise Checks

| Check                      | Description                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Mailbox Rules              | This will present any mailbox rules found for the client.                                                                 |
| Recently added users       | This will display any newly created users in the tenantl.                                                                 |
| New Applications           | This will display any newly registered enterprise applications.                                                           |
| Mailbox permission changes | This will identify any suspicious mailbox permission changes.                                                             |
| MFA Devices                | This will identify any MFA devices for review, including when the type of device and the datetime when it was registered. |
| Password Changes           | This will display any recent password changes for the tenant.                                                             |



### Actions

| Action          | Description                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Refresh Data    | This will refresh the analysis for the user and update the Indicators of Compromise checks.                                                |
| Remediate User  | This action will block user sign-in, reset the user's password, disconnect all current sessions, and disable all inbox rules for the user. |
| Download Report | This will download a JSON file for the checks completed in the analysis.                                                                   |

