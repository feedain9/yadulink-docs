---
sidebar_position: 7
title: Using Yadulink in n8n
description: Install and configure the Yadulink n8n integration, create an API key, run workflows, and handle credits, jobs and webhooks.
---

# Using Yadulink in n8n

n8n is the recommended way to automate Yadulink without building a full application. The n8n connector calls the Yadulink API, so your account, subscription, credits, scopes and safety limits all stay under Yadulink's control.

## What you can automate

With n8n you can:

- create or update leads from a form, a CRM or an internal database;
- read your Yadulink lists and leads;
- check the API credit balance;
- run a profile visit;
- send a connection request;
- message an eligible contact;
- like or comment on a post;
- follow a job's state;
- trigger a workflow when a job finishes.

## Prerequisites

- An active Yadulink account.
- An active Yadulink subscription.
- A LinkedIn account connected in Yadulink for LinkedIn actions.
- API credits available for paid actions.
- A Yadulink API key with the required scopes.
- n8n Cloud, or self-hosted with community nodes enabled if you use the Yadulink node.

## Install the community node

Package:

```text
n8n-nodes-yadulink
```

In n8n:

1. Open **Settings**.
2. Open **Community nodes**.
3. Install `n8n-nodes-yadulink`.
4. Restart n8n if your environment asks for it.

Self-hosted, check that community nodes are allowed:

```bash
N8N_COMMUNITY_PACKAGES_ENABLED=true
```

Manual install if needed:

```bash
npm install n8n-nodes-yadulink
```

## Create the Yadulink credential

1. In Yadulink, open **Integrations > n8n**.
2. Create the n8n API key from that page: it uses the `n8n_full` preset.
3. Copy the key.
4. In n8n, create a `Yadulink API` credential.
5. Paste the API key.
6. Keep the default URL:

```text
https://app.yadulink.com/api/v1
```

## Test the connection

Add a `Yadulink` node.

| Field | Value |
| --- | --- |
| Resource | `Account` |
| Operation | `Get Current User` |

If the connection works, Yadulink returns the authenticated account.

Useful follow-up checks:

| Check | What it verifies |
| --- | --- |
| `Account > Get Account Status` | Subscription, API eligibility, LinkedIn connection |
| `Account > Get Limits` | Available limits and budgets |
| `Credits > Get Balance` | Credit balance |
| `Account > Get Developer Manifest` | The machine-readable API contract |

## Use the HTTP Request node

If an operation is not in the community node yet, use n8n's native HTTP Request node.

| Field | Value |
| --- | --- |
| Method | Depends on the endpoint |
| URL | `https://app.yadulink.com/api/v1/...` |
| Authentication | Header Auth |
| Header | `Authorization: Bearer yd_your_api_key` |
| Body Content Type | JSON |

The OpenAPI schema is available at:

```text
GET https://app.yadulink.com/api/v1/openapi.json
```

## Recommended workflow: create a lead

A form or a CRM pushes a prospect into n8n, and n8n creates the lead in Yadulink.

Suggested payload:

```json
{
  "external_id": "crm_123",
  "email": "ada@example.com",
  "list_id": 123,
  "full_name": "Ada Lovelace",
  "company_name": "Analytical Engines",
  "position": "Founder",
  "linkedin_url": "https://www.linkedin.com/in/example"
}
```

Recommended idempotency key:

```text
{{$json.external_id}}-create-lead
```

If the CRM replays the event, Yadulink does not create a duplicate.

## Recommended workflow: run an action

Create a lead, then visit their profile.

1. Trigger node: n8n webhook, CRM, Google Sheets or any other source.
2. Yadulink node: create or update the lead.
3. Yadulink node: `Action > Create Job`.
4. Wait node: a few minutes if you poll.
5. Yadulink node: `Job > Get`.
6. Branch on `data.status`.

Possible statuses:

- `queued`
- `running`
- `completed`
- `failed`
- `canceled`

Prefer a webhook trigger over frequent polling.

## Recommended workflow: receive results over webhook

With `Yadulink Trigger` you can listen to:

- `job.completed`
- `job.failed`
- `job.canceled`
- `lead.created`
- `lead.status_changed`

The trigger creates the webhook in Yadulink when the workflow is activated, and removes it when it is deactivated. HMAC verification is handled by the node.

## Handle credits in n8n

Before running volume:

1. Call `Credits > Get Balance`.
2. Call `Credits > Quote Action`.
3. Compare `total_cost` with `balance.available`.
4. Stop the workflow if `can_run` is `false`.

A simple threshold:

```text
If available < 150, stop the workflow and raise an alert.
```

This check keeps a workflow from failing halfway through a loop.

## Idempotency in n8n

Send an idempotency key on every operation that creates or changes something.

```text
{{$execution.id}}-{{$itemIndex}}-create-lead
{{$json.external_id}}-create-lead
{{$json.crm_id}}-send-message-step-1
{{$json.linkedin_url}}-profile-visit-{{$now.format("yyyy-MM-dd")}}
```

Good practice:

- Use a stable business identifier when you have one.
- Add `{{$itemIndex}}` when one execution processes several items.
- Do not reuse the same key for a different operation.
- Keep the key identical when you want a retry to be deduplicated.

## Frequent errors in n8n

| Code | Cause | What to do |
| --- | --- | --- |
| `invalid_api_key` | Key missing or wrong | Check the credential |
| `subscription_required` | Subscription inactive | Reactivate Yadulink |
| `insufficient_scope` | Missing scope | Recreate a key with the right preset |
| `insufficient_api_credits` | Balance too low | Buy credits or lower the volume |
| `public_action_budget_unavailable` | Action budget reached | Add a Wait, or run later |
| `linkedin_account_required` | LinkedIn not connected | Reconnect LinkedIn in Yadulink |
| `idempotency_key_reused` | Same key, different payload | Fix the idempotency key |
| `rate_limit_exceeded` | More than 100 requests in a minute | Add a Wait between items |

## Production checklist

- Test on a single lead before looping.
- Send an idempotency key on every mutation.
- Check the balance before large volumes.
- Use job webhooks where you can.
- Keep the API key in the n8n credentials.
- Add a Wait inside loops.
- Do not run two workflows that contact the same lead at once.
- Add an error branch for `insufficient_api_credits` and `public_action_budget_unavailable`.
