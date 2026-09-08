---
sidebar_position: 3
title: API credits
description: Understand Yadulink API credits, what is free, what is billed, how reservations work and how to estimate a cost before running volume.
---

# API credits

API credits measure the actions run from the API or from integrations such as n8n. They open a powerful automation surface without making its use unlimited.

An active Yadulink subscription is still required. Credits grant the right to consume API actions; they do not replace the subscription.

## What is free

Plain reads cost nothing:

- testing a key with `GET /me`;
- reading account status;
- reading limits;
- reading the credit balance;
- reading existing lists and leads;
- reading a job status;
- reading or managing webhooks.

## What consumes credits

Mutations and value-carrying actions consume credits.

| Operation | Cost |
| --- | ---: |
| `lead_create` | 1 credit |
| `lead_update` | 1 credit |
| `lead_delete` | 1 credit |
| `list_create` | 1 credit |
| `list_update` | 1 credit |
| `list_delete` | 1 credit |
| `profile_visit` | 2 credits |
| `post_like` | 2 credits |
| `post_comment` | 8 credits |
| `send_connection_request` | 10 credits |
| `send_message` | 10 credits |
| `sequence_create` | 5 credits |

:::note
The table can change as endpoints are added. The cost the API reports is the authority, through `GET /developer/manifest`, `GET /actions` and `POST /credits/quote`.
:::

## Available balance and reserved credits

The balance separates several values:

| Field | Meaning |
| --- | --- |
| `available` | Credits ready to be used |
| `reserved` | Credits held by queued or running jobs |
| `included_monthly` | Included credits still available in the current cycle |
| `purchased` | Purchased credits still available |
| `used_this_cycle` | Credits consumed in the current cycle |

Example:

```json
{
  "success": true,
  "data": {
    "available": 820,
    "reserved": 20,
    "included_monthly": 620,
    "purchased": 200,
    "used_this_cycle": 180,
    "currency": "credits",
    "cycle_key": "2026-05"
  },
  "meta": {}
}
```

## How credits are consumed

Yadulink uses a wallet, buckets and ledger model.

| Element | Role |
| --- | --- |
| Wallet | The account balance |
| Bucket | A group of credits by origin and expiry |
| Ledger | An append-only history of every movement |

Credits come from several origins: included, purchased, granted or refunded. When an action consumes credits, Yadulink spends the usable credits that expire soonest first. That avoids holding credits close to expiry while newer ones are being spent.

Every movement is written to the ledger:

| Type | Meaning |
| --- | --- |
| `grant` | Included, purchased or granted credits added |
| `reserve` | Held for an asynchronous job |
| `commit` | Consumption confirmed |
| `refund` | A reservation returned |
| `expire` | A bucket expired |
| `adjustment` | Manual adjustment |

## Synchronous calls

For a plain mutation, creating a lead for instance:

1. Yadulink validates the key, the scopes, the subscription and the payload.
2. Yadulink runs the mutation.
3. If it succeeds, Yadulink debits the credits.
4. If it fails, no credit is debited.

`POST /leads` costs 1 credit when the lead is actually created.

## Asynchronous jobs

Sensitive LinkedIn actions run as jobs — sending a connection request, for example.

A job's life cycle:

1. You create the job.
2. Yadulink reserves the credits it needs.
3. The job goes `queued`, then `running`.
4. If the action succeeds, the reservation is committed.
5. If it fails for good or is canceled, the reservation is refunded.
6. If it is automatically rescheduled, the credits stay reserved until the final outcome.

This keeps actions from starting without a balance, while never charging for an action that did not go through.

## Idempotency and credits

Idempotency protects your balance too.

Replay a request with the same idempotency key, path and payload, and Yadulink returns the first response without recreating the action and without debiting again.

Reuse the same key with a different payload and Yadulink returns `idempotency_key_reused`.

## Estimate a cost

Use `POST /credits/quote` before running volume.

```bash
curl https://app.yadulink.com/api/v1/credits/quote \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "send_message",
    "quantity": 25
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "operation": "send_message",
    "quantity": 25,
    "unit_cost": 10,
    "total_cost": 250,
    "currency": "credits",
    "can_run": true,
    "balance": {
      "available": 820,
      "reserved": 0
    }
  },
  "meta": {}
}
```

## Read the ledger

```bash
curl "https://app.yadulink.com/api/v1/credits/ledger?page=1&per_page=50" \
  -H "Authorization: Bearer yd_your_api_key"
```

Useful filters:

| Parameter | Example |
| --- | --- |
| `entry_type` | `commit`, `reserve`, `refund` |
| `operation` | `send_message`, `lead_create` |
| `page` | `1` |
| `per_page` | `50` |

## Credit packs

Available packs are shown in the app and exposed by `GET /credits/packs`.

| Pack | Credits | Indicative price |
| --- | ---: | ---: |
| 1,000 API credits | 1,000 | EUR 50 |
| 10,000 API credits | 10,000 | EUR 200 |
| Custom pack | On request | On request |

Checkout for a pack starts from an authenticated Yadulink session, not from an API key alone.

## Insufficient balance

When the available balance is too low, Yadulink returns:

```json
{
  "success": false,
  "error": {
    "code": "insufficient_api_credits",
    "message": "Not enough API credits to run this operation.",
    "details": {
      "operation": "send_message",
      "required": 100,
      "available": 40,
      "currency": "credits"
    }
  }
}
```

In n8n, handle this case explicitly: stop the workflow, raise an alert or lower the volume.
