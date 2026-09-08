---
sidebar_position: 9
title: API errors and troubleshooting
description: Understand Yadulink API errors, the most frequent codes, and the steps to fix a workflow or an integration.
---

# API errors and troubleshooting

Every Yadulink API error uses the same shape:

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

Branch on `error.code` in your workflows or in your code. The `message` text may change to read better.

Every response carries an `X-Request-ID` header. Keep it: it is what lets support find the exact call in your key's log. Send your own `X-Request-ID` and Yadulink reuses it instead of generating one.

## HTTP codes

| HTTP code | Meaning |
| ---: | --- |
| `400` | Invalid request, wrong payload or missing parameter |
| `401` | Missing authentication or invalid API key |
| `403` | Access refused: missing scope, subscription required or suspended account |
| `404` | Resource not found |
| `409` | Conflict, for example an idempotency key reused with a different payload |
| `429` | Too many requests, or a temporarily unavailable budget |
| `5xx` | Temporary error on the Yadulink side |

## Frequent errors

| Code | Likely cause | What to do |
| --- | --- | --- |
| `invalid_api_key` | Key missing, unknown, inactive or expired | Check the credential or create a new key |
| `subscription_required` | Yadulink subscription inactive | Reactivate the subscription |
| `insufficient_scope` | The key lacks the required scope | Create a key with the right scopes |
| `insufficient_api_credits` | Available balance too low | Buy credits or lower the volume |
| `public_action_budget_unavailable` | Safety budget reached | Wait, or slow the pace down |
| `linkedin_account_required` | LinkedIn is not connected | Reconnect LinkedIn in Yadulink |
| `idempotency_key_reused` | Same idempotency key used with a different payload | Generate a different key |
| `public_action_jobs_disabled` | Action jobs temporarily unavailable | Retry later |
| `public_api_operation_disabled` | Operation temporarily disabled | Pick another operation or retry later |
| `public_api_suspended` | API access suspended | Contact the Yadulink team |
| `unknown_action` | Unknown action operation | Read `GET /actions` |
| `unknown_operation` | Unknown credit operation | Call `POST /credits/quote` with a valid operation |
| `rate_limit_exceeded` | More than 100 requests in the current minute | Honor `Retry-After`, space the calls out |

## Diagnose an API key

1. Test `GET /me`.
2. Check `GET /account/status`.
3. Check the key's scopes.
4. Check that the subscription is active.
5. Check that LinkedIn is connected if the action touches LinkedIn.

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_your_api_key"
```

## Diagnose credits

If you get `insufficient_api_credits`:

1. Read `GET /credits/balance`.
2. Call `POST /credits/quote` with the same operation and quantity.
3. Compare `available` with `reserved`.
4. Wait for the jobs holding reservations to finish, or buy a pack.

```bash
curl https://app.yadulink.com/api/v1/credits/balance \
  -H "Authorization: Bearer yd_your_api_key"
```

Remember:

- `available` is what you can actually spend.
- `reserved` is held by queued or running jobs.
- A job that fails for good or is canceled refunds its reservation.

## Diagnose a job

If a job never finishes:

1. Read `GET /jobs/{job_id}`.
2. Look at `status`.
3. Look at `error.code` if the job is `failed`.
4. Look at `retry_after_at` if the job was rescheduled.
5. Check the budget with `GET /actions`.

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123 \
  -H "Authorization: Bearer yd_your_api_key"
```

If you no longer need the job:

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123/cancel \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key"
```

## Diagnose a webhook

If your webhook receives nothing:

1. Check that the webhook is active.
2. Send a `test` event.
3. Read `GET /webhooks/health`.
4. Read the latest deliveries.
5. Verify the signature on your side.
6. Check that your endpoint answers `2xx`.

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/test \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key"
```

## What to send support

To speed up a diagnosis, send:

- the response's `X-Request-ID`;
- the endpoint called;
- the HTTP method;
- the approximate time;
- the `error.code`;
- the `job_id` if the error concerns a job;
- the `webhook_id` or `delivery.id` if it concerns a webhook;
- the API key prefix, never the full key;
- the idempotency key if the request was idempotent.

Never share your full API key.
