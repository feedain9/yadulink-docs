---
sidebar_position: 4
title: Référence des endpoints
description: Liste des endpoints API Yadulink v1 pour le compte, les crédits, les listes, les leads, les messages, les actions, les jobs et les webhooks.
---

# Référence des endpoints

Tous les endpoints ci-dessous utilisent l'URL de base :

```text
https://app.yadulink.com/api/v1
```

:::tip
Cette page est un aperçu par domaine, pratique pour choisir un endpoint. Pour les paramètres exacts, les corps de requête et les codes de réponse, ouvrez la [**référence OpenAPI**](/api/reference/) : elle est générée depuis le schéma servi par l'API, donc toujours à jour.
:::

## Conventions

Les réponses suivent toujours la même structure :

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Les erreurs suivent la structure :

```json
{
  "success": false,
  "error": {
    "code": "stable_error_code",
    "message": "Message lisible",
    "details": {}
  }
}
```

## Pagination

Les endpoints de liste utilisent généralement :

| Paramètre | Défaut | Maximum | Usage |
| --- | ---: | ---: | --- |
| `page` | `1` | - | Page demandée |
| `per_page` | `20` ou `50` | `100` | Nombre d'éléments par page |

Les informations de pagination sont renvoyées dans `meta` ou dans le payload selon l'endpoint.

## Compte

| Méthode | Endpoint | Scope | Crédits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/me` | Clé API valide | 0 | Tester l'authentification |
| `GET` | `/account/status` | `account:read` | 0 | Lire l'éligibilité API, abonnement et LinkedIn |
| `GET` | `/account/limits` | `account:read` | 0 | Lire les limites, crédits et budgets d'action |
| `GET` | `/developer/manifest` | `account:read` | 0 | Lire le contrat machine-readable |
| `GET` | `/openapi.json` | Public selon accès | 0 | Lire le schéma OpenAPI |

### Exemple : statut du compte

```bash
curl https://app.yadulink.com/api/v1/account/status \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Crédits

| Méthode | Endpoint | Scope | Crédits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/credits/balance` | `credits:read` | 0 | Lire le solde courant |
| `GET` | `/credits/ledger` | `credits:read` | 0 | Lire l'historique des mouvements |
| `GET` | `/credits/packs` | `credits:read` | 0 | Lister les packs disponibles |
| `POST` | `/credits/quote` | `credits:read` | 0 | Estimer le coût d'une opération |
| `POST` | `/credits/packs/{pack_id}/checkout` | Session app | 0 | Démarrer un checkout Stripe depuis Yadulink |

### Exemple : lire le solde

```bash
curl https://app.yadulink.com/api/v1/credits/balance \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Listes

| Méthode | Endpoint | Scope | Crédits | Idempotence | Description |
| --- | --- | --- | ---: | --- | --- |
| `GET` | `/lists` | `lists:read` | 0 | Non | Lister les listes |
| `POST` | `/lists` | `lists:write` | 1 | Oui | Créer une liste |
| `GET` | `/lists/{list_id}` | `lists:read` | 0 | Non | Lire une liste |
| `PUT` | `/lists/{list_id}` | `lists:write` | 1 | Oui | Modifier une liste |
| `DELETE` | `/lists/{list_id}` | `lists:write` | 1 | Oui | Supprimer une liste |
| `GET` | `/lists/{list_id}/leads` | `leads:read` | 0 | Non | Lister les leads d'une liste |

### Exemple : créer une liste

```bash
curl https://app.yadulink.com/api/v1/lists \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: crm-list-2026-05" \
  -d '{
    "name": "Prospects mai 2026"
  }'
```

## Leads

| Méthode | Endpoint | Scope | Crédits | Idempotence | Description |
| --- | --- | --- | ---: | --- | --- |
| `GET` | `/leads` | `leads:read` | 0 | Non | Lister les leads avec filtres |
| `GET` | `/leads/search` | `leads:read` | 0 | Non | Rechercher dans les leads |
| `GET` | `/leads/{lead_id}` | `leads:read` | 0 | Non | Lire un lead |
| `POST` | `/leads` | `leads:write` | 1 | Oui | Créer un lead |
| `PUT` | `/leads/{lead_id}` | `leads:write` | 1 | Oui | Modifier un lead |
| `DELETE` | `/leads/{lead_id}` | `leads:write` | 1 | Oui | Supprimer un lead |

### Exemple : créer un lead

```bash
curl https://app.yadulink.com/api/v1/leads \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
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

### Recherche de leads

```bash
curl "https://app.yadulink.com/api/v1/leads/search?q=founder&per_page=25" \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Messages

| Méthode | Endpoint | Scope | Crédits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/messages` | `messages:read` | 0 | Lister les messages disponibles |
| `GET` | `/messages/{message_id}` | `messages:read` | 0 | Lire un message |

L'envoi de messages LinkedIn se fait via les jobs d'action avec l'opération `send_message`.

## Actions et jobs

| Méthode | Endpoint | Scope | Crédits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/actions` | `account:read` | 0 | Lister les actions disponibles |
| `POST` | `/actions/{operation}/jobs` | `jobs:write` plus scope action | Réservation | Créer un job d'action |
| `GET` | `/jobs/{job_id}` | `jobs:read` | 0 | Lire l'état d'un job |
| `POST` | `/jobs/{job_id}/cancel` | `jobs:write` | 0 | Annuler un job et rembourser si possible |

Opérations disponibles :

| Opération | Scope action | Coût |
| --- | --- | ---: |
| `profile_visit` | `profiles:write` | 2 crédits |
| `post_like` | `posts:write` | 2 crédits |
| `post_comment` | `posts:write` | 8 crédits |
| `send_connection_request` | `connections:write` | 10 crédits |
| `send_message` | `messages:write` | 10 crédits |

### Exemple : créer un job de visite de profil

```bash
curl https://app.yadulink.com/api/v1/actions/profile_visit/jobs \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: profile-visit-crm_123" \
  -d '{
    "lead_id": 123
  }'
```

## Webhooks

| Méthode | Endpoint | Scope | Crédits | Description |
| --- | --- | --- | ---: | --- |
| `GET` | `/webhooks` | `webhooks:manage` | 0 | Lister les endpoints webhook |
| `GET` | `/webhooks/health` | `webhooks:manage` | 0 | Lire l'état de santé des webhooks |
| `GET` | `/webhooks/{webhook_id}` | `webhooks:manage` | 0 | Lire un webhook |
| `POST` | `/webhooks` | `webhooks:manage` | 0 | Créer un webhook |
| `PUT` | `/webhooks/{webhook_id}` | `webhooks:manage` | 0 | Modifier un webhook |
| `POST` | `/webhooks/{webhook_id}/activate` | `webhooks:manage` | 0 | Réactiver un webhook |
| `POST` | `/webhooks/{webhook_id}/deactivate` | `webhooks:manage` | 0 | Désactiver un webhook |
| `DELETE` | `/webhooks/{webhook_id}` | `webhooks:manage` | 0 | Supprimer un webhook |
| `POST` | `/webhooks/{webhook_id}/test` | `webhooks:manage` | 0 | Envoyer un événement test |
| `POST` | `/webhooks/{webhook_id}/rotate-secret` | `webhooks:manage` | 0 | Tourner le secret de signature |
| `GET` | `/webhooks/{webhook_id}/deliveries` | `webhooks:manage` | 0 | Lister les tentatives de livraison |
| `GET` | `/webhooks/{webhook_id}/deliveries/{delivery_id}` | `webhooks:manage` | 0 | Lire une tentative |
| `POST` | `/webhooks/{webhook_id}/deliveries/{delivery_id}/replay` | `webhooks:manage` | 0 | Rejouer une livraison |

## Endpoints Zapier historiques

Certains endpoints de polling et de souscription Zapier peuvent exister pour compatibilité. Pour un nouveau projet, privilégiez l'API v1 documentée ici ou le connecteur n8n quand votre besoin est orienté workflow.

## OpenAPI

Pour obtenir la référence machine-readable :

```bash
curl https://app.yadulink.com/api/v1/openapi.json
```

Le schéma OpenAPI expose les chemins, scopes, paramètres, réponses et métadonnées `x-yadulink`, notamment les coûts en crédits quand ils existent.
