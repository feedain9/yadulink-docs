---
sidebar_position: 8
title: Limits and quotas
description: Understand the Yadulink API rate limit, the LinkedIn action safety budgets, and how both differ from API credits.
---

# Limits and quotas

Three different mechanisms can refuse a call. They do not replace or compensate for one another.

| Mechanism | What it protects | Error returned |
| --- | --- | --- |
| Rate limit | The Yadulink platform | `rate_limit_exceeded` (429) |
| Action budget | Your LinkedIn account | `public_action_budget_unavailable` (429) |
| API credits | Your consumption | `insufficient_api_credits` (403) |

## Rate limit

Each API key gets **100 requests per minute**. The window is aligned to the clock minute rather than sliding: the counter resets when the minute changes.

When the limit is hit, the API returns `429` with a `Retry-After` header giving the seconds until the next window.

```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Limit: 100 requests/minute"
  }
}
```

Your key's current limit is shown on its card in **Integrations > API > API keys > Manage**.

:::tip
In n8n, prefer batching with a delay between items over parallel calls. A loop that processes 500 leads without a pause hits the limit in seconds; the same loop with a one-second `Wait` never does.
:::

## LinkedIn action safety budgets

LinkedIn actions carry their own budget, independent of the credit balance. It protects your LinkedIn account from a workflow that loops.

| Operation | Per day | Per week | Minimum interval |
| --- | ---: | ---: | ---: |
| `profile_visit` | 80 | — | 120 s |
| `post_like` | 80 | — | 60 s |
| `post_comment` | 80 | — | 90 s |
| `send_connection_request` | 60 | 200 | 90 s |
| `send_message` | 80 | — | 60 s |

These values are served live by `GET /actions`, which also reports the current budget state per operation. Ask it before running volume rather than discovering the limit halfway through the loop.

```bash
curl https://app.yadulink.com/api/v1/actions \
  -H "Authorization: Bearer yd_your_api_key"
```

When a budget is unavailable, job creation fails with `public_action_budget_unavailable` and no job is created: no credit is reserved.

## Credits

Credits are a consumption counter, not a rate limit. A sufficient balance does not allow you past the request limit, and staying under the request limit does not exempt you from having credits.

See [API credits](/api/credits-api/) for the price table and the reserve / commit / refund cycle.

## Diagnosing a refusal

1. Read `error.code`: each of the three mechanisms has its own.
2. On a `429`, honor `Retry-After` before retrying.
3. Keep the response's `X-Request-ID` header: it is the identifier support uses to find the call.
4. For an action budget, read `GET /actions` to know when the window reopens.
