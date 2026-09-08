---
slug: /mcp
sidebar_position: 0
title: Yadulink MCP connector
description: The Yadulink MCP server, its URL, its OAuth authentication, its scopes and the compatible clients.
---

# Yadulink MCP connector

The MCP (Model Context Protocol) connector gives an AI assistant bounded access to your Yadulink workspace: reading your LinkedIn signals, your lists, your sequences and your inbox, then preparing or running actions within the limits you allow.

It is the recommended path for an assistant. A REST API key remains the right choice for a script, a CRM or an n8n workflow.

## Server URL

```text
https://mcp.yadulink.com/mcp/
```

The transport is Streamable HTTP. Paste this URL into the compatible client of your choice: it is the only value to configure.

## Authentication

The server accepts OAuth 2.1 with PKCE. You authorize access from your Yadulink account, and the assistant receives a token limited to the permissions granted — there is no key to paste into the conversation.

| Element | Value |
| --- | --- |
| Authorization server metadata | `https://app.yadulink.com/.well-known/oauth-authorization-server` |
| Dynamic client registration (RFC 7591) | `https://app.yadulink.com/oauth/register` |
| Authorization | `https://app.yadulink.com/oauth/authorize` |
| Token | `https://app.yadulink.com/oauth/token` |

Authorized applications are visible and revocable at any time from **Integrations > MCP configuration**.

## Permissions

MCP scopes are distinct from REST scopes: they describe what an assistant may do on your own account.

| Scope | Allows |
| --- | --- |
| `mcp:self:profile:read` | Read the connected profile and its progress |
| `mcp:self:messages:read` | Read and summarize the LinkedIn inbox |
| `mcp:self:messages:write` | Send an explicitly confirmed message in an existing conversation |
| `mcp:self:outreach:read` | Audit lists, sequences and contact priorities |
| `mcp:self:outreach:write` | Run controlled outreach actions |
| `mcp:self:content:read` | Read feeds, signals, publications and statistics |
| `mcp:self:content:write` | Manage publications and run confirmed content actions |
| `mcp:self:credits:read` | Read the API credit balance and the price table |

Any action that touches LinkedIn always asks for an explicit confirmation before running, and stays subject to the same activity limits as the interface.

## Compatible clients

- [Claude](/integrations/connecter-claude-avec-yadulink/)
- [ChatGPT](/integrations/connecter-chatgpt-avec-yadulink/)
- Manus, Codex and any OAuth-compatible MCP client: just add the server URL.

Step-by-step guides per client are available in **Yadulink > Integrations**, with the exact configuration to copy.

## What about the REST API?

MCP and the REST API share the same account, the same activity limits and the same credits, but they answer two different needs.

| | MCP | REST API |
| --- | --- | --- |
| For | A conversational assistant | A script, a CRM, a workflow |
| Authentication | OAuth, no key to paste | `yd_…` API key |
| Interface | Tools described to the assistant | Versioned HTTP endpoints |

For the REST API, start with the [API introduction](/api/introduction/).
