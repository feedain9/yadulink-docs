---
sidebar_position: 2
title: Authentification et clés API
description: Créer une clé API Yadulink, comprendre les scopes, sécuriser les accès et éviter les doublons avec l'idempotence.
---

# Authentification et clés API

Les appels API utilisent une clé API Yadulink transmise dans le header `Authorization`.

```http
Authorization: Bearer yd_votre_cle_api
```

Une clé API ne remplace pas l'abonnement Yadulink. Si l'abonnement n'est plus actif, l'API refuse les appels même si la clé existe encore.

## Créer une clé API

Quand l'accès API est disponible sur votre compte :

1. Ouvrez **Yadulink > Integrations**.
2. Ouvrez la zone liée à l'API ou à n8n.
3. Créez une clé avec le preset adapté.
4. Copiez la clé complète immédiatement.
5. Stockez-la dans votre outil serveur, votre credential n8n ou votre gestionnaire de secrets.

:::warning
La clé complète n'est affichée qu'une seule fois. Yadulink ne stocke pas la clé en clair.
:::

## Types de clés

| Type | Usage recommandé |
| --- | --- |
| `api` | Intégration REST générique |
| `n8n` | Workflows n8n et community node Yadulink |
| `zapier` | Connecteur Zapier |
| `make` | Connecteur Make |
| `mcp` | Connecteur MCP |

Pour n8n, utilisez le preset recommandé :

```json
{
  "preset": "n8n_full",
  "key_type": "n8n"
}
```

## Scopes

Les scopes limitent ce qu'une clé peut faire. Si un endpoint exige un scope absent, Yadulink renvoie `insufficient_scope`.

| Scope | Autorise |
| --- | --- |
| `account:read` | Lire le statut du compte, les limites et le manifeste développeur |
| `credits:read` | Lire le solde, l'historique, les packs et les estimations de crédits |
| `leads:read` | Lire et rechercher les leads |
| `leads:write` | Créer, modifier ou supprimer des leads |
| `lists:read` | Lire les listes |
| `lists:write` | Créer, modifier ou supprimer des listes |
| `messages:read` | Lire les messages disponibles |
| `messages:write` | Envoyer des messages via jobs |
| `profiles:write` | Visiter des profils via jobs |
| `posts:write` | Liker ou commenter des posts via jobs |
| `connections:write` | Envoyer des demandes de connexion via jobs |
| `webhooks:manage` | Créer, modifier, désactiver et rejouer des webhooks |
| `jobs:read` | Lire l'état des jobs |
| `jobs:write` | Créer ou annuler des jobs |

## Scopes recommandés par usage

| Usage | Scopes minimum |
| --- | --- |
| Vérifier la connexion | Aucun scope spécifique pour `GET /me` |
| Lire solde et statut | `account:read`, `credits:read` |
| Synchroniser des leads | `leads:read`, `leads:write`, `lists:read` |
| Créer des listes | `lists:read`, `lists:write` |
| Utiliser n8n largement | Preset `n8n_full` |
| Recevoir et gérer des webhooks | `webhooks:manage` |
| Lancer des actions LinkedIn | `jobs:write` plus le scope action concerné |

## Tester une clé

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Si la clé est valide, l'API renvoie l'utilisateur et les informations de clé.

## Sécurité

Appliquez ces règles :

- Ne mettez jamais une clé API dans du JavaScript côté navigateur.
- Stockez la clé dans les credentials n8n, une variable d'environnement ou un coffre de secrets.
- Créez une clé différente par outil ou environnement.
- Donnez uniquement les scopes nécessaires.
- Révoquez immédiatement une clé exposée.
- N'envoyez jamais la clé dans une URL ou un log.

## Idempotence

Les workflows no-code et les systèmes distribués peuvent relancer une requête. Pour éviter les doublons, ajoutez une clé d'idempotence aux opérations qui créent, modifient, suppriment ou lancent une action.

Headers acceptés :

```http
Idempotency-Key: external-operation-id
X-Idempotency-Key: external-operation-id
```

Règles appliquées :

- Même méthode, même chemin et même body avec la même clé : Yadulink rejoue la première réponse.
- Même clé avec un body différent : Yadulink renvoie `idempotency_key_reused`.
- L'idempotence est recommandée sur `POST`, `PUT`, `PATCH` et `DELETE`.

Exemples utiles dans n8n :

```text
{{$execution.id}}-{{$itemIndex}}-create-lead
{{$json.crm_id}}-send-message
{{$json.external_event_id}}-connection-request
```

## Exemple de création de lead avec idempotence

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
    "linkedin_url": "https://www.linkedin.com/in/example"
  }'
```

## Erreurs d'authentification courantes

| Code | Signification | Action |
| --- | --- | --- |
| `invalid_api_key` | Clé absente, inconnue, inactive ou expirée | Vérifier la clé ou en créer une nouvelle |
| `subscription_required` | Abonnement Yadulink actif requis | Réactiver l'abonnement |
| `insufficient_scope` | Scope manquant | Créer une clé avec les bons scopes |
| `public_api_suspended` | Accès API suspendu | Contacter l'équipe Yadulink |
| `public_api_operation_disabled` | Une opération est temporairement désactivée | Réessayer plus tard ou adapter le workflow |
