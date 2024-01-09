---
description: Manage scheduled tenant alerts.
---

# Alerts Wizard

CIPP offers a set of scheduled, recurring alert checks. Some of these duplicate Microsoft Alerts functionality in a more MSP-friendly manner, some are not available as a Microsoft Alert at this time.

Within CIPP, there are two types of alerts.&#x20;

* Tenant Administration > Administration > **Classic Alerts**
* Tenant Administration > Administration > Alert Rules

Similar to [Tenant Standards](https://github.com/KelvinTegelaar/CIPP/blob/website/docs/user/usingcipp/standards/README.md), you configure alerts using the wizard to select one or more tenants or -All Tenants- to apply alerts globally, then select from the list of available alerts.

Alert email delivers to the email address or webhook provided in CIPP settings. Alerts are delivered as an HTML-formatted table. Alerts fire once per incident - for example, a full mailbox does not fire an alert every time it's checked).

{% hint style="info" %}
Classic Alert scans run every hour
{% endhint %}

### Available Alerts

* Alert on users without any form of MFA
* Alert on admins without any form of MFA
* Alert on tenants without a Conditional Access policy, while having Conditional Access licensing available
* Alert on new users added to any admin role
* Alert on changed admin Passwords
* Alert if Defender is not running (Tenant must be on-boarded in Lighthouse)
* Alert on Defender Malware found (Tenant must be on-boarded in Lighthouse)
* Alert on 90% mailbox quota used
* Alert on unused licenses
* Alert on expiring application secrets
* Alert on expiring APN certificates
* Alert on expiring VPP tokens
* Alert on expiring DEP tokens



### API Calls

The following APIs are called on this page:

{% swagger src="../../../.gitbook/assets/openapicipp.json" path="/AddAlert" method="post" %}
[openapicipp.json](../../../.gitbook/assets/openapicipp.json)
{% endswagger %}

### Feature Requests / Ideas

Please raise any [feature requests](https://github.com/KelvinTegelaar/CIPP/issues/new?assignees=\&labels=enhancement%2Cno-priority\&projects=\&template=feature.yml\&title=%5BFeature+Request%5D%3A+) on GitHub.