---
description: >-
  This page displays options for editing the user's properties, license
  assignment, password reset, and group memberships.
---

# Edit User

***

### Getting Started

* **Navigate to:** Identity Management > Administration > Users
* Select a user > Click **Edit User** in the **Actions** menu
* You will be landed on the "**Edit User**" tab.

### Page Layout

**Header Information** on this page displays the user's Display Name, their User Principal Name (with copy option) and the Account Creation Date

### Basic Information

1. **User Identity:** `First Name`, `Last Name`, `Display Name`, `Username` (before the @ symbol), `Primary Domain name` (select from dropdown)
2. **Email Aliases:**  Add multiple email aliases one per line without domain (added automatically)
3. **Professional Details:** `Job Title`, `Department`, `Company Name`
4. **Contact Details:** `Street Address`, `Postal Code`, `Mobile Phone`, `Business Phone`, `Alternate Email Address`
5. **Management:** `Set Manager` (select from existing users), `Copy groups from another user`

### Account Settings

1. **Password Options**
   * `Create password manually` (toggle)
     * When `enabled`: Enter custom password
     * When `disabled`: System generates secure password
   * `Require password change at next logon` (toggle)
2. **Location Settings**
   * `Usage Location` (required for licensing)
   * Select `country` from dropdown

### License Management

* **Current Licenses**
  * Shows currently assigned licenses
  * Option to remove all licenses (toggle)
* **License Modifications**
  * Replace Licenses (toggle)
    * When enabled: Select new licenses to assign
    * Shows available license count for each option
* **SherWeb Integration** (if enabled)
  * Auto-purchase option appears when licenses unavailable
  * Select license SKU for purchase
  * System handles purchase and assignment

### **Custom Attributes**

* Custom attributes can be configured in **Preferences > General Settings**
* These include specific Azure AD attributes that will be available when creating new users:
* **Available Attributes:** `consentProvidedForMinor`, `employeeId`, `employeeHireDate`, `employeeLeaveDateTime`, `employeeType`, `faxNumber`,`legalAgeGroupClassification`, `officeLocation`, `otherMails`, `showInAddressList`, `state`
* **Configuration:**
  * Go to **Preferences** page under your user profile.
  * Under **General Settings**
  * Find **Added Attributes when creating a new user**
  * Select desired attributes from dropdown
  * Selected attributes will appear on **Add User** form

### Notes

* Changes take effect immediately upon saving
* License changes require valid usage location
* Password resets follow complexity requirements
* Group membership changes are processed in order (removals then additions)
* On-premises synced accounts show warning about limited editability

{% include "../../../../../.gitbook/includes/feature-request.md" %}
