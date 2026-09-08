---
sidebar_position: 2
title: Authentication and API keys
description: Create a Yadulink API key, understand scopes, secure your access and avoid duplicates with idempotency.
---

# Authentication and API keys

API calls carry a Yadulink API key in the `Authorization` header.

```http
Authorization: Bearer yd_your_api_key
```

An API key does not replace the Yadulink subscription. If the subscription lapses, the API refuses calls even though the key still exists.

## Create an API key

1. Open **Yadulink > Integrations > API**, **API keys** tab.
2. Click **New key**.
3. Choose an access level. **Read-only** is the default; **Full API access** opens every REST permission; **Chosen permissions** lets you tick exactly what your application needs.
4. Name the key after the tool that will use it, and leave an expiry in place.
5. Copy the full key immediately. Yadulink also shows a ready-to-paste `curl` command to check the connection.
6. Store it in your server tool, your n8n credential or your secrets manager.

For n8n, go through **Integrations > n8n** instead: that page creates a key with the `n8n_full` preset and fills in the base URL for you.

An existing key can be renamed and re-scoped from **Manage** without changing its value. **Renew the value** generates a new secret and invalidates the old one immediately.

:::warning
The full key is shown once. Yadulink does not store it in clear text.
:::

## Key types

| Type | Recommended use |
| --- | --- |
| `api` | Generic REST integration |
| `n8n` | n8n workflows and the Yadulink community node |
| `zapier` | Zapier connector |
| `make` | Make connector |
| `mcp` | MCP connector |

For n8n, use the recommended preset:

```json
{
  "preset": "n8n_full",
  "key_type": "n8n"
}
```

## Scopes

Scopes limit what a key can do. When an endpoint requires a scope the key does not carry, Yadulink returns `insufficient_scope`.

| Scope | Allows |
| --- | --- |
| `account:read` | Read account status, limits and the developer manifest |
| `credits:read` | Read the balance, the ledger, the packs and credit estimates |
| `leads:read` | Read and search leads |
| `leads:write` | Create, update or delete leads |
| `lists:read` | Read lists |
| `lists:write` | Create, update or delete lists |
| `messages:read` | Read available messages |
| `messages:write` | Send messages through jobs |
| `profiles:write` | Visit profiles through jobs |
| `posts:write` | Like or comment on posts through jobs |
| `connections:write` | Send connection requests through jobs |
| `webhooks:manage` | Create, update, disable and replay webhooks |
| `jobs:read` | Read job status |
| `jobs:write` | Create or cancel jobs |

## Recommended scopes by use case

| Use case | Minimum scopes |
| --- | --- |
| Check the connection | No specific scope for `GET /me` |
| Read balance and status | `account:read`, `credits:read` |
| Sync leads | `leads:read`, `leads:write`, `lists:read` |
| Create lists | `lists:read`, `lists:write` |
| Use n8n broadly | `n8n_full` preset |
| Receive and manage webhooks | `webhooks:manage` |
| Run LinkedIn actions | `jobs:write` plus the action scope involved |

## Test a key

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_your_api_key"
```

If the key is valid, the API returns the account and the key information.

## Security

Apply these rules:

- Never put an API key in browser-side JavaScript.
- Store the key in n8n credentials, an environment variable or a secrets vault.
- Create a different key per tool or per environment.
- Grant only the scopes you need.
- Revoke an exposed key immediately.
- Never send the key in a URL or a log.

## Idempotency

No-code workflows and distributed systems retry requests. To avoid duplicates, add an idempotency key to operations that create, update, delete or start an action.

Accepted headers:

```http
Idempotency-Key: external-operation-id
X-Idempotency-Key: external-operation-id
```

Rules:

- Same method, same path and same body with the same key: Yadulink replays the first response.
- Same key with a different body: Yadulink returns `idempotency_key_reused`.
- Idempotency is recommended on `POST`, `PUT`, `PATCH` and `DELETE`.

Useful patterns in n8n:

```text
{{$execution.id}}-{{$itemIndex}}-create-lead
{{$json.crm_id}}-send-message
{{$json.external_event_id}}-connection-request
```

## Creating a lead with idempotency

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
    "linkedin_url": "https://www.linkedin.com/in/example"
  }'
```

## Common authentication errors

| Code | Meaning | What to do |
| --- | --- | --- |
| `invalid_api_key` | Key missing, unknown, inactive or expired | Check the key or create a new one |
| `subscription_required` | An active Yadulink subscription is required | Reactivate the subscription |
| `insufficient_scope` | Missing scope | Create a key with the right scopes |
| `public_api_suspended` | API access suspended | Contact the Yadulink team |
| `public_api_operation_disabled` | An operation is temporarily disabled | Retry later or adapt the workflow |
