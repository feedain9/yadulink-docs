---
sidebar_position: 1
title: Yadulink API
description: Understand the Yadulink API, its versioning, its credit model, its prerequisites and the first steps to connect Yadulink to your tools.
---

# Yadulink API

The Yadulink API connects Yadulink to your internal tools, to n8n, to a CRM, to a product of your own or to an automation system. It reads your Yadulink data, syncs leads, runs LinkedIn actions as jobs and delivers events over webhooks.

API access rests on three rules:

- An active Yadulink account is required.
- Actions that carry value consume API credits.
- Sensitive LinkedIn actions run as asynchronous jobs, under safety limits.

:::info
The API is available with an active Yadulink subscription. You drive it from **Integrations > API**, where you will find your keys, your credit balance and your usage.
:::

## Base URL

The production public API lives at:

```text
https://app.yadulink.com/api/v1
```

Example:

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_your_api_key"
```

## Versioning

The API is versioned in the URL.

| Version | Status | URL |
| --- | --- | --- |
| `v1` | Current version | `https://app.yadulink.com/api/v1` |

Yadulink applies these principles:

- Backward-compatible additions stay in `/api/v1`.
- A new field can be added without changing the version.
- An existing field does not change type or meaning without a new version.
- A removal or an incompatible change ships in a new version, for example `/api/v2`.
- Webhooks also carry `api_version` and `schema_version` so the payloads you receive are versioned too.

## Response format

Every successful response follows this shape:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Every error follows this shape:

```json
{
  "success": false,
  "error": {
    "code": "stable_error_code",
    "message": "Human readable message",
    "details": {}
  }
}
```

`error.code` is stable and safe to branch on in your n8n workflows or in your code.

## What the API can do

| Domain | Examples |
| --- | --- |
| Account | Test the key, read account status, check the subscription and LinkedIn |
| Credits | Read the balance, browse the ledger, estimate the cost of an operation |
| Lists | List, create, update and delete lists |
| Leads | Search, create, update and delete leads |
| Messages | Read available messages and queue sending jobs |
| LinkedIn actions | Visit a profile, like, comment, send a connection request, send a message |
| Jobs | Track, cancel and diagnose asynchronous actions |
| Webhooks | Receive `lead.*` and `job.*` events, and test deliveries |
| n8n | Use Yadulink from no-code or low-code workflows |

## Prerequisites

Before using the API:

- Your Yadulink account needs an active subscription.
- Your LinkedIn account must be connected in Yadulink for LinkedIn actions.
- You need an API key, created from **Integrations > API**.
- Your key needs the required scopes.
- Your balance needs enough credits for the paid actions.

## First request

Use `GET /me` to check that your key works:

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_your_api_key"
```

Typical response:

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "Ada",
    "last_name": "Lovelace",
    "api_access": {
      "eligible": true
    }
  }
}
```

`GET /me` costs no credit: it is the first call to make when an integration stops answering.

## Machine-readable documentation

Two endpoints matter for advanced tooling:

| Endpoint | Purpose |
| --- | --- |
| `GET /openapi.json` | OpenAPI schema of the public API |
| `GET /developer/manifest` | Yadulink contract enriched with credits, scopes, actions and webhooks |

The OpenAPI schema is what you point n8n's HTTP Request node, an API client or a code generator at.

The [**OpenAPI reference**](/api/reference/) in this documentation is generated from that schema: it is the authority for parameters, request bodies and response codes.

Every response carries an `X-Request-ID` header. Keep it in your logs: it is the identifier support uses to find a specific call. Send your own and Yadulink will reuse it.

## Read next

- [Authentication and API keys](/api/authentification-et-cles-api/)
- [API credits](/api/credits-api/)
- [Endpoint reference](/api/endpoints/)
- [Actions and jobs](/api/actions-et-jobs/)
- [Webhooks](/api/webhooks/)
- [Limits and quotas](/api/limites-et-quotas/)
- [Using Yadulink in n8n](/api/n8n/)
- [Generated OpenAPI reference](/api/reference/)
