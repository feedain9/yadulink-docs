---
sidebar_position: 5
title: Actions et jobs
description: Lancer des actions LinkedIn via l'API Yadulink, comprendre les jobs asynchrones, les budgets de sécurité, les statuts et les remboursements de crédits.
---

# Actions et jobs

Les actions LinkedIn sensibles ne sont pas exécutées comme de simples requêtes synchrones. Elles sont mises en file sous forme de jobs afin de protéger votre compte LinkedIn, gérer les délais, éviter les doublons et rembourser les crédits si l'action ne peut pas aboutir.

## Pourquoi des jobs ?

Un job est nécessaire quand l'action :

- touche LinkedIn ;
- peut prendre du temps ;
- doit respecter un budget de sécurité ;
- peut être reprogrammée ;
- doit réserver puis confirmer ou rembourser des crédits.

Exemples : visite de profil, like, commentaire, demande de connexion, message.

## Opérations disponibles

| Opération | Description | Scope requis | Coût |
| --- | --- | --- | ---: |
| `profile_visit` | Visiter un profil LinkedIn | `profiles:write` | 2 crédits |
| `post_like` | Liker un post LinkedIn | `posts:write` | 2 crédits |
| `post_comment` | Commenter un post LinkedIn | `posts:write` | 8 crédits |
| `send_connection_request` | Envoyer une demande de connexion | `connections:write` | 10 crédits |
| `send_message` | Envoyer un message à un contact éligible | `messages:write` | 10 crédits |

Chaque création de job exige aussi `jobs:write`.

## Lire les actions disponibles

```bash
curl https://app.yadulink.com/api/v1/actions \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Cet endpoint renvoie les opérations disponibles, le scope requis, le coût unitaire et l'état du budget de sécurité.

## Cibles acceptées

Pour une action sur profil, indiquez au moins un identifiant de cible :

| Champ | Usage |
| --- | --- |
| `lead_id` | ID du lead Yadulink |
| `profile_id` | ID de profil interne si disponible |
| `provider_id` | ID fournisseur LinkedIn si disponible |
| `public_identifier` | Identifiant public LinkedIn |
| `profile_url` | URL de profil LinkedIn |
| `linkedin_url` | Alias accepté pour l'URL LinkedIn |

Utilisez `lead_id` quand vous le pouvez. C'est le plus stable dans Yadulink.

## Créer un job

Endpoint :

```text
POST /actions/{operation}/jobs
```

### Visite de profil

```bash
curl https://app.yadulink.com/api/v1/actions/profile_visit/jobs \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: profile-visit-lead-123" \
  -d '{
    "lead_id": 123
  }'
```

### Demande de connexion

```bash
curl https://app.yadulink.com/api/v1/actions/send_connection_request/jobs \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: connection-request-lead-123" \
  -d '{
    "lead_id": 123,
    "connection_note": "Bonjour Ada, votre travail sur les moteurs analytiques m'intéresse beaucoup."
  }'
```

### Message

```bash
curl https://app.yadulink.com/api/v1/actions/send_message/jobs \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: send-message-lead-123-step-1" \
  -d '{
    "lead_id": 123,
    "message": "Bonjour Ada, je me permets de vous écrire car votre activité semble proche de nos clients actuels."
  }'
```

### Like de post

```bash
curl https://app.yadulink.com/api/v1/actions/post_like/jobs \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: post-like-urn-123" \
  -d '{
    "post_id": "urn:li:activity:123"
  }'
```

### Commentaire de post

```bash
curl https://app.yadulink.com/api/v1/actions/post_comment/jobs \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: post-comment-urn-123" \
  -d '{
    "post_id": "urn:li:activity:123",
    "comment": "Très intéressant, merci pour le partage."
  }'
```

## Cycle des crédits

Quand vous créez un job :

1. Yadulink vérifie le scope et le budget de sécurité.
2. Yadulink vérifie que le solde disponible couvre le coût.
3. Yadulink réserve les crédits.
4. Le job est mis en file.
5. Si le job réussit, les crédits réservés sont confirmés.
6. Si le job échoue définitivement ou est annulé, les crédits réservés sont remboursés.

Le solde `available` baisse dès la réservation. Le solde `reserved` augmente tant que le job n'est pas terminé.

## Statuts de job

| Statut | Sens | Crédits |
| --- | --- | --- |
| `queued` | En attente d'exécution | Réservés |
| `running` | Exécution en cours | Réservés |
| `completed` | Action terminée | Confirmés |
| `failed` | Échec définitif | Remboursés si réservés |
| `canceled` | Annulé | Remboursés si possible |

## Lire un job

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123 \
  -H "Authorization: Bearer yd_votre_cle_api"
```

La réponse contient notamment :

- `status` ;
- `operation` ;
- `result` si disponible ;
- `error` si le job a échoué ;
- `retry_after_at` si Yadulink recommande d'attendre ;
- `credits.reserved`, `credits.committed`, `credits.refunded`.

## Annuler un job

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123/cancel \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Idempotency-Key: cancel-job-123"
```

Une annulation rembourse les crédits uniquement si le job n'a pas déjà été finalisé.

## Budgets de sécurité

Les budgets de sécurité sont séparés des crédits. Ils évitent qu'un workflow n8n ou un script lance trop d'actions LinkedIn.

| Opération | Limite quotidienne | Limite hebdomadaire | Intervalle minimum |
| --- | ---: | ---: | ---: |
| `profile_visit` | 80 | Aucun | 120 s |
| `post_like` | 80 | Aucun | 60 s |
| `post_comment` | 80 | Aucun | 90 s |
| `send_connection_request` | 60 | 200 | 90 s |
| `send_message` | 80 | Aucun | 60 s |

Si le budget n'est pas disponible, l'API renvoie `public_action_budget_unavailable` avec un détail comme `daily_limit_reached`, `weekly_limit_reached` ou `last_action_too_recent`.

## Retry et reprogrammation

Certains échecs sont temporaires : session LinkedIn momentanément indisponible, action trop récente, fenêtre de sécurité fermée ou dépendance externe lente.

Dans ce cas :

- le job peut rester en attente ou être reprogrammé ;
- `retry_after_at` ou `retry_after_seconds` indique quand réessayer ;
- les crédits restent réservés ;
- aucun remboursement n'est fait tant que le job n'est pas finalement échoué ou annulé.

## Bonnes pratiques

- Utilisez toujours une clé d'idempotence pour créer un job.
- Testez d'abord avec un seul lead.
- Lisez `GET /actions` avant un gros volume pour vérifier le budget.
- Préférez les webhooks `job.completed`, `job.failed` et `job.canceled` au polling intensif.
- Ajoutez des pauses dans n8n quand vous bouclez sur plusieurs prospects.
- Ne lancez pas plusieurs workflows qui contactent le même lead au même moment.
