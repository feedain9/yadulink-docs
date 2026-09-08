---
sidebar_position: 5
title: Actions and jobs
description: Run LinkedIn actions through the Yadulink API, understand asynchronous jobs, safety budgets, statuses and credit refunds.
---

# Actions and jobs

Sensitive LinkedIn actions do not run as plain synchronous requests. They are queued as jobs, so that Yadulink can protect your LinkedIn account, pace the work, avoid duplicates, and refund the credits when an action cannot go through.

## Why jobs?

An action needs a job when it:

- touches LinkedIn;
- can take time;
- must respect a safety budget;
- may be rescheduled;
- must reserve credits, then commit or refund them.

Profile visits, likes, comments, connection requests and messages all qualify.

## Available operations

| Operation | Description | Required scope | Cost |
| --- | --- | --- | ---: |
| `profile_visit` | Visit a LinkedIn profile | `profiles:write` | 2 credits |
| `post_like` | Like a LinkedIn post | `posts:write` | 2 credits |
| `post_comment` | Comment on a LinkedIn post | `posts:write` | 8 credits |
| `send_connection_request` | Send a connection request | `connections:write` | 10 credits |
| `send_message` | Message an eligible contact | `messages:write` | 10 credits |

Creating any job also requires `jobs:write`.

## Read the available actions

```bash
curl https://app.yadulink.com/api/v1/actions \
  -H "Authorization: Bearer yd_your_api_key"
```

This endpoint returns the available operations, the required scope, the unit cost and the current safety budget state.

## Accepted targets

For a profile action, give at least one target identifier:

| Field | Use |
| --- | --- |
| `lead_id` | Yadulink lead id |
| `profile_id` | Internal profile id when available |
| `provider_id` | LinkedIn provider id when available |
| `public_identifier` | LinkedIn public identifier |
| `profile_url` | LinkedIn profile URL |
| `linkedin_url` | Accepted alias for the profile URL |

Use `lead_id` whenever you can. It is the most stable identifier in Yadulink.

## Create a job

Endpoint:

```text
POST /actions/{operation}/jobs
```

### Profile visit

```bash
curl https://app.yadulink.com/api/v1/actions/profile_visit/jobs \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: profile-visit-lead-123" \
  -d '{
    "lead_id": 123
  }'
```

### Connection request

```bash
curl https://app.yadulink.com/api/v1/actions/send_connection_request/jobs \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: connection-request-lead-123" \
  -d '{
    "lead_id": 123,
    "connection_note": "Hi Ada, your work on analytical engines caught my eye."
  }'
```

### Message

```bash
curl https://app.yadulink.com/api/v1/actions/send_message/jobs \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: send-message-lead-123-step-1" \
  -d '{
    "lead_id": 123,
    "message": "Hi Ada, reaching out because your work looks close to what our customers do."
  }'
```

### Post like

```bash
curl https://app.yadulink.com/api/v1/actions/post_like/jobs \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: post-like-urn-123" \
  -d '{
    "post_id": "urn:li:activity:123"
  }'
```

### Post comment

```bash
curl https://app.yadulink.com/api/v1/actions/post_comment/jobs \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: post-comment-urn-123" \
  -d '{
    "post_id": "urn:li:activity:123",
    "comment": "Really interesting, thanks for sharing."
  }'
```

## The credit cycle

When you create a job:

1. Yadulink checks the scope and the safety budget.
2. Yadulink checks that the available balance covers the cost.
3. Yadulink reserves the credits.
4. The job is queued.
5. If the job succeeds, the reserved credits are committed.
6. If the job fails for good or is canceled, the reserved credits are refunded.

`available` drops as soon as the reservation is made. `reserved` stays up until the job finishes.

## Job statuses

| Status | Meaning | Credits |
| --- | --- | --- |
| `queued` | Waiting to run | Reserved |
| `running` | Running | Reserved |
| `completed` | Action finished | Committed |
| `failed` | Failed for good | Refunded if reserved |
| `canceled` | Canceled | Refunded where possible |

## Read a job

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123 \
  -H "Authorization: Bearer yd_your_api_key"
```

The response carries, among others:

- `status`;
- `operation`;
- `result` when available;
- `error` if the job failed;
- `retry_after_at` when Yadulink recommends waiting;
- `credits.reserved`, `credits.committed`, `credits.refunded`.

## Cancel a job

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123/cancel \
  -X POST \
  -H "Authorization: Bearer yd_your_api_key" \
  -H "Idempotency-Key: cancel-job-123"
```

A cancellation refunds credits only if the job has not already been finalized.

## Safety budgets

Safety budgets are separate from credits. They keep an n8n workflow or a script from running too many LinkedIn actions.

| Operation | Daily limit | Weekly limit | Minimum interval |
| --- | ---: | ---: | ---: |
| `profile_visit` | 80 | None | 120 s |
| `post_like` | 80 | None | 60 s |
| `post_comment` | 80 | None | 90 s |
| `send_connection_request` | 60 | 200 | 90 s |
| `send_message` | 80 | None | 60 s |

When the budget is unavailable, the API returns `public_action_budget_unavailable` with a detail such as `daily_limit_reached`, `weekly_limit_reached` or `last_action_too_recent`.

## Retries and rescheduling

Some failures are temporary: a LinkedIn session briefly unavailable, an action attempted too soon, a closed safety window, a slow external dependency.

In that case:

- the job can stay pending or be rescheduled;
- `retry_after_at` or `retry_after_seconds` says when to try again;
- the credits stay reserved;
- nothing is refunded until the job finally fails or is canceled.

## Good practice

- Always send an idempotency key when creating a job.
- Test with a single lead first.
- Read `GET /actions` before running volume, to check the budget.
- Prefer the `job.completed`, `job.failed` and `job.canceled` webhooks over aggressive polling.
- Add pauses in n8n when looping over several prospects.
- Do not run several workflows that contact the same lead at the same time.
