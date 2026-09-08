---
slug: /mcp
sidebar_position: 0
title: Connecteur MCP Yadulink
description: Le serveur MCP Yadulink, son URL, son authentification OAuth, ses scopes et les clients compatibles.
---

# Connecteur MCP Yadulink

Le connecteur MCP (Model Context Protocol) donne à un assistant IA un accès encadré à ton espace Yadulink : lire tes signaux LinkedIn, tes listes, tes séquences et ta messagerie, puis préparer ou lancer des actions dans les limites que tu autorises.

C'est la voie recommandée pour un assistant. Une clé API REST reste le bon choix pour un script, un CRM ou un workflow n8n.

## URL du serveur

```text
https://mcp.yadulink.com/mcp/
```

Le transport est Streamable HTTP. Colle cette URL dans le client compatible de ton choix : c'est la seule valeur à configurer.

## Authentification

Le serveur accepte OAuth 2.1 avec PKCE. Tu autorises l'accès depuis ton compte Yadulink, et l'assistant reçoit un jeton limité aux permissions accordées — il n'y a aucune clé à coller dans la conversation.

| Élément | Valeur |
| --- | --- |
| Métadonnées du serveur d'autorisation | `https://app.yadulink.com/.well-known/oauth-authorization-server` |
| Enregistrement dynamique de client (RFC 7591) | `https://app.yadulink.com/oauth/register` |
| Autorisation | `https://app.yadulink.com/oauth/authorize` |
| Jeton | `https://app.yadulink.com/oauth/token` |

Les applications autorisées sont visibles et révocables à tout moment depuis **Integrations > Configuration MCP**.

## Permissions

Les scopes MCP sont distincts des scopes REST : ils décrivent ce qu'un assistant peut faire sur ton propre compte.

| Scope | Autorise |
| --- | --- |
| `mcp:self:profile:read` | Lire le profil connecté et sa progression |
| `mcp:self:messages:read` | Lire et résumer la messagerie LinkedIn |
| `mcp:self:messages:write` | Envoyer un message explicitement confirmé dans une conversation existante |
| `mcp:self:outreach:read` | Auditer listes, séquences et priorités de contact |
| `mcp:self:outreach:write` | Lancer des actions de prospection contrôlées |
| `mcp:self:content:read` | Lire fils d'actu, signaux, publications et statistiques |
| `mcp:self:content:write` | Gérer les publications et les actions de contenu confirmées |
| `mcp:self:credits:read` | Lire le solde de crédits API et le barème |

Une action qui touche LinkedIn demande toujours une confirmation explicite avant exécution, et reste soumise aux mêmes limites d'activité que l'interface.

## Clients compatibles

- [Claude](/integrations/connecter-claude-avec-yadulink/)
- [ChatGPT](/integrations/connecter-chatgpt-avec-yadulink/)
- Manus, Codex et tout client MCP compatible OAuth : ajoute simplement l'URL du serveur.

Les guides pas à pas par client sont disponibles dans **Yadulink > Integrations**, avec la configuration exacte à copier.

## Et l'API REST ?

MCP et l'API REST partagent le même compte, les mêmes limites d'activité et les mêmes crédits, mais répondent à deux usages différents.

| | MCP | API REST |
| --- | --- | --- |
| Pour | Un assistant conversationnel | Un script, un CRM, un workflow |
| Authentification | OAuth, sans clé à coller | Clé API `yd_…` |
| Interface | Outils décrits à l'assistant | Endpoints HTTP versionnés |

Pour l'API REST, commence par l'[introduction API](/api/introduction/).
