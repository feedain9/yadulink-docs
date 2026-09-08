---
sidebar_position: 6
title: Webhooks
description: Configure Yadulink webhooks, receive events, verify the HMAC signature, understand retries and replay a delivery.
---

# Webhooks

Webhooks let Yadulink push an event to your tool when something happens: a lead is created, a lead's status changes, a job finishes.

They are useful to:

- trigger an n8n workflow;
- update a CRM;
- receive a job result without polling;
- audit Yadulink events in an external system.

## Available events

| Event | When it is sent |
| --- | --- |
| `lead.created` | A lead is created |
| `lead.status_changed` | A lead's status changes |
| `job.completed` | An API job succeeds |
| `job.failed` | An API job fails for good |
| `job.canceled` | An API job is canceled |
| `test` | Test event |

## Create a webhook

```bash
curl https://app.yadulink.com/api/v1/webhooks \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/yadulink/webhook",
    "events": ["job.completed", "job.failed", "job.canceled"],
    "description": "Production n8n webhook"
  }'
```

Typical response:

```json
{
  "success": true,
  "data": {
    "id": 456,
    "url": "https://example.com/yadulink/webhook",
    "events": ["job.completed", "job.failed", "job.canceled"],
    "active": true,
    "secret": "whsec_xxx"
  },
  "meta": {}
}
```

:::warning
Treat the signing secret as a secret. Never expose it in a browser or a log.
:::

## The payload you receive

```json
{
  "id": "evt_xxx",
  "event": "job.completed",
  "api_version": "v1",
  "schema_version": "2026-05-11",
  "created_at": "2026-05-11T10:30:00Z",
  "timestamp": "2026-05-11T10:30:00Z",
  "delivery": {
    "id": 123,
    "attempt": 1,
    "max_attempts": 5,
    "webhook_id": 456
  },
  "account": {
    "user_id": 789,
    "email": "user@example.com"
  },
  "data": {
    "job_id": "job_123",
    "operation": "send_message",
    "status": "completed"
  }
}
```

The identifiers that matter:

| Field | Use |
| --- | --- |
| `id` | Stable identifier of the business event |
| `delivery.id` | Identifier of the delivery attempt |
| `delivery.attempt` | Attempt number |
| `api_version` | API version that produced the event |
| `schema_version` | Payload schema version |

When Yadulink retries a delivery, `id` stays the same. Use it to deduplicate on your side.

## Headers sent

Yadulink adds useful headers:

```http
X-Yadulink-Event: job.completed
X-Yadulink-Event-Id: evt_xxx
X-Yadulink-Webhook-Id: 456
X-Yadulink-Delivery-Id: 123
X-Yadulink-Delivery-Attempt: 1
X-Yadulink-Api-Version: v1
X-Yadulink-Schema-Version: 2026-05-11
X-Yadulink-Signature: t=...,v1=...
```

## Verify the signature

Yadulink signs the exact request body with HMAC-SHA256.

Header:

```http
X-Yadulink-Signature: t=timestamp,v1=signature
```

Signed payload:

```text
timestamp.raw_json_payload
```

Node.js example:

```js
import crypto from "node:crypto";

function verifyYadulinkSignature({ rawBody, signatureHeader, secret }) {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => part.split("="))
  );

  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  if (signature.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex")
  );
}
```

:::warning
Verify the signature against the raw body, before JSON parsing. If your framework rewrites the body first, the signature will no longer match.
:::

## Retries

Yadulink automatically retries temporary failures:

- timeout;
- network error;
- HTTP `408`;
- HTTP `409`;
- HTTP `425`;
- HTTP `429`;
- HTTP `5xx`.

Yadulink does not retry errors it treats as unrecoverable:

- HTTP `400`;
- HTTP `401`;
- HTTP `403`;
- HTTP `404`;
- HTTP `410`.

The retry policy uses exponential backoff, up to five attempts.

## Webhook health

Read the state:

```bash
curl https://app.yadulink.com/api/v1/webhooks/health \
  -H "Authorization: Bearer yd_your_api_key"
```

The payload lists the endpoints to look at, the failure counters and the latest failed deliveries.

If an endpoint fails too often, Yadulink can disable it automatically to stop a failure loop.

To bring it back:

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/activate \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key"
```

## Test a webhook

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/test \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key"
```

Yadulink sends a `test` event.

## Replay a delivery

1. List the deliveries:

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/deliveries \
  -H "Authorization: Bearer yd_your_api_key"
```

2. Replay a specific attempt:

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/deliveries/123/replay \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key"
```

A replay keeps the same business event `id`, so your deduplication still holds.

## n8n

With the Yadulink community node, prefer `Yadulink Trigger`. It creates and removes the webhook as the workflow is activated or deactivated, and it verifies the HMAC signature for you.
