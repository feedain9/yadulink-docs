---
sidebar_position: 4
title: Endpoint reference
description: Yadulink API v1 endpoints for account, credits, lists, leads, messages, actions, jobs and webhooks.
---

# Endpoint reference

Every endpoint below uses the base URL:

```text
https://app.yadulink.com/api/v1
```

:::tip
This page is an overview by domain, handy for picking an endpoint. For exact parameters, request bodies and response codes, open the [**OpenAPI reference**](/api/reference/): it is generated from the schema the API serves, so it is always current.
:::

## Conventions

Responses always follow the same shape:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Errors follow this shape:

```json
{
  "success": false,
  "error": {
    "code": "stable_error_code",
    "message": "Readable message",
    "details": {}
  }
}
```

## Pagination

List endpoints generally accept:

| Parameter | Default | Maximum | Purpose |
| --- | ---: | ---: | --- |
| `page` | `1` | - | Requested page |
| `per_page` | `20` or `50` | `100` | Items per page |

Pagination details come back in `meta` or in the payload, depending on the endpoint.

## Account

| Method | Endpoint | Scope | Credits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/me` | Valid API key | 0 | Test authentication |
| `GET` | `/account/status` | `account:read` | 0 | Read API eligibility, subscription and LinkedIn |
| `GET` | `/account/limits` | `account:read` | 0 | Read limits, credits and action budgets |
| `GET` | `/developer/manifest` | `account:read` | 0 | Read the machine-readable contract |
| `GET` | `/openapi.json` | Public | 0 | Read the OpenAPI schema |

### Example: account status

```bash
curl https://app.yadulink.com/api/v1/account/status \
  -H "Authorization: Bearer yd_your_api_key"
```

## Credits

| Method | Endpoint | Scope | Credits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/credits/balance` | `credits:read` | 0 | Read the current balance |
| `GET` | `/credits/ledger` | `credits:read` | 0 | Read the movement history |
| `GET` | `/credits/packs` | `credits:read` | 0 | List the available packs |
| `POST` | `/credits/quote` | `credits:read` | 0 | Estimate the cost of an operation |
| `POST` | `/credits/packs/{pack_id}/checkout` | App session | 0 | Start a Stripe checkout from Yadulink |

### Example: read the balance

```bash
curl https://app.yadulink.com/api/v1/credits/balance \
  -H "Authorization: Bearer yd_your_api_key"
```

## Lists

| Method | Endpoint | Scope | Credits | Idempotency | Description |
| --- | --- | --- | ---: | --- | --- |
| `GET` | `/lists` | `lists:read` | 0 | No | List the lists |
| `POST` | `/lists` | `lists:write` | 1 | Yes | Create a list |
| `GET` | `/lists/{list_id}` | `lists:read` | 0 | No | Read a list |
| `PUT` | `/lists/{list_id}` | `lists:write` | 1 | Yes | Update a list |
| `DELETE` | `/lists/{list_id}` | `lists:write` | 1 | Yes | Delete a list |
| `GET` | `/lists/{list_id}/leads` | `leads:read` | 0 | No | List the leads of a list |

### Example: create a list

```bash
curl https://app.yadulink.com/api/v1/lists \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: crm-list-2026-05" \
  -d '{
    "name": "May 2026 prospects"
  }'
```

## Leads

| Method | Endpoint | Scope | Credits | Idempotency | Description |
| --- | --- | --- | ---: | --- | --- |
| `GET` | `/leads` | `leads:read` | 0 | No | List leads with filters |
| `GET` | `/leads/search` | `leads:read` | 0 | No | Search leads |
| `GET` | `/leads/{lead_id}` | `leads:read` | 0 | No | Read a lead |
| `POST` | `/leads` | `leads:write` | 1 | Yes | Create a lead |
| `PUT` | `/leads/{lead_id}` | `leads:write` | 1 | Yes | Update a lead |
| `DELETE` | `/leads/{lead_id}` | `leads:write` | 1 | Yes | Delete a lead |

### Example: create a lead

```bash
curl https://app.yadulink.com/api/v1/leads \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: crm_123-create-lead" \
  -d '{
    "list_id": 123,
    "full_name": "Ada Lovelace",
    "company_name": "Analytical Engines",
    "position": "Founder",
    "linkedin_url": "https://www.linkedin.com/in/example",
    "email": "ada@example.com"
  }'
```

### Search leads

```bash
curl "https://app.yadulink.com/api/v1/leads/search?q=founder&per_page=25" \
  -H "Authorization: Bearer yd_your_api_key"
```

## Messages

| Method | Endpoint | Scope | Credits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/messages` | `messages:read` | 0 | List available messages |
| `GET` | `/messages/{message_id}` | `messages:read` | 0 | Read a message |

Sending a LinkedIn message goes through the action jobs, with the `send_message` operation.

## Actions and jobs

| Method | Endpoint | Scope | Credits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/actions` | `account:read` | 0 | List the available actions |
| `POST` | `/actions/{operation}/jobs` | `jobs:write` plus the action scope | Reserved | Create an action job |
| `GET` | `/jobs/{job_id}` | `jobs:read` | 0 | Read a job's state |
| `POST` | `/jobs/{job_id}/cancel` | `jobs:write` | 0 | Cancel a job and refund where possible |

Available operations:

| Operation | Action scope | Cost |
| --- | --- | ---: |
| `profile_visit` | `profiles:write` | 2 credits |
| `post_like` | `posts:write` | 2 credits |
| `post_comment` | `posts:write` | 8 credits |
| `send_connection_request` | `connections:write` | 10 credits |
| `send_message` | `messages:write` | 10 credits |

### Example: create a profile visit job

```bash
curl https://app.yadulink.com/api/v1/actions/profile_visit/jobs \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: profile-visit-crm_123" \
  -d '{
    "lead_id": 123
  }'
```

## Webhooks

| Method | Endpoint | Scope | Credits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/webhooks` | `webhooks:manage` | 0 | List webhook endpoints |
| `GET` | `/webhooks/health` | `webhooks:manage` | 0 | Read webhook health |
| `GET` | `/webhooks/{webhook_id}` | `webhooks:manage` | 0 | Read one webhook |
| `POST` | `/webhooks` | `webhooks:manage` | 0 | Create a webhook |
| `PUT` | `/webhooks/{webhook_id}` | `webhooks:manage` | 0 | Update a webhook |
| `POST` | `/webhooks/{webhook_id}/activate` | `webhooks:manage` | 0 | Reactivate a webhook |
| `POST` | `/webhooks/{webhook_id}/deactivate` | `webhooks:manage` | 0 | Deactivate a webhook |
| `DELETE` | `/webhooks/{webhook_id}` | `webhooks:manage` | 0 | Delete a webhook |
| `POST` | `/webhooks/{webhook_id}/test` | `webhooks:manage` | 0 | Send a test event |
| `POST` | `/webhooks/{webhook_id}/rotate-secret` | `webhooks:manage` | 0 | Rotate the signing secret |
| `GET` | `/webhooks/{webhook_id}/deliveries` | `webhooks:manage` | 0 | List delivery attempts |
| `GET` | `/webhooks/{webhook_id}/deliveries/{delivery_id}` | `webhooks:manage` | 0 | Read one attempt |
| `POST` | `/webhooks/{webhook_id}/deliveries/{delivery_id}/replay` | `webhooks:manage` | 0 | Replay a delivery |

## Zapier endpoints

Polling and subscription endpoints exist for the Zapier connector: `/zapier/poll/leads`, `/zapier/poll/messages`, `/zapier/subscribe` and `/zapier/unsubscribe/{webhook_id}`. For a new project, prefer the v1 API documented here, or the n8n connector when the need is workflow-shaped.

## OpenAPI

To fetch the machine-readable reference:

```bash
curl https://app.yadulink.com/api/v1/openapi.json
```

The schema exposes paths, scopes, parameters, responses and `x-yadulink` metadata, including credit costs where they apply.
