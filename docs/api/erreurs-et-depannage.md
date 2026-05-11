---
sidebar_position: 8
title: Erreurs et dépannage API
description: Comprendre les erreurs API Yadulink, les codes les plus fréquents et les actions à prendre pour corriger un workflow ou une intégration.
---

# Erreurs et dépannage API

Toutes les erreurs API Yadulink utilisent le même format :

```json
{
  "success": false,
  "error": {
    "code": "stable_error_code",
    "message": "Message lisible par un humain",
    "details": {}
  }
}
```

Utilisez `error.code` dans vos workflows ou dans votre code. Le texte `message` peut évoluer pour être plus clair.

## Codes HTTP

| Code HTTP | Sens |
| ---: | --- |
| `400` | Requête invalide, payload incorrect ou paramètre manquant |
| `401` | Authentification absente ou clé API invalide |
| `403` | Accès refusé, scope manquant, abonnement requis ou compte suspendu |
| `404` | Ressource introuvable |
| `409` | Conflit, par exemple clé d'idempotence réutilisée avec un payload différent |
| `429` | Trop de requêtes ou budget temporairement indisponible |
| `5xx` | Erreur temporaire côté Yadulink |

## Erreurs fréquentes

| Code | Cause probable | Action recommandée |
| --- | --- | --- |
| `invalid_api_key` | Clé absente, inconnue, inactive ou expirée | Vérifier le credential ou créer une nouvelle clé |
| `subscription_required` | Abonnement Yadulink inactif | Réactiver l'abonnement |
| `insufficient_scope` | La clé n'a pas le scope requis | Créer une clé avec les bons scopes |
| `insufficient_api_credits` | Solde disponible trop faible | Acheter des crédits ou réduire le volume |
| `public_action_budget_unavailable` | Budget de sécurité atteint | Attendre ou réduire le rythme |
| `linkedin_account_required` | LinkedIn n'est pas connecté | Reconnecter LinkedIn dans Yadulink |
| `idempotency_key_reused` | Même clé d'idempotence utilisée avec un payload différent | Générer une clé différente |
| `public_action_jobs_disabled` | Jobs d'action temporairement indisponibles | Réessayer plus tard |
| `public_api_operation_disabled` | Opération temporairement désactivée | Choisir une autre opération ou réessayer plus tard |
| `public_api_suspended` | Accès API suspendu | Contacter l'équipe Yadulink |
| `unknown_action` | Opération d'action inconnue | Lire `GET /actions` |
| `unknown_operation` | Opération de crédit inconnue | Lire `POST /credits/quote` avec une opération valide |
| `rate_limited` | Trop de requêtes | Ajouter des délais ou réduire la concurrence |

## Diagnostiquer une clé API

1. Testez `GET /me`.
2. Vérifiez `GET /account/status`.
3. Vérifiez les scopes de la clé.
4. Vérifiez que l'abonnement est actif.
5. Vérifiez que LinkedIn est connecté si l'action touche LinkedIn.

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Diagnostiquer les crédits

Si vous recevez `insufficient_api_credits` :

1. Lisez `GET /credits/balance`.
2. Lisez `POST /credits/quote` avec la même opération et la même quantité.
3. Vérifiez la différence entre `available` et `reserved`.
4. Attendez la fin des jobs qui réservent des crédits ou achetez un pack.

```bash
curl https://app.yadulink.com/api/v1/credits/balance \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Rappel :

- `available` correspond aux crédits réellement utilisables.
- `reserved` correspond aux crédits bloqués par des jobs en attente ou en cours.
- Un job échoué définitivement ou annulé rembourse les crédits réservés.

## Diagnostiquer un job

Si un job ne se termine pas :

1. Lisez `GET /jobs/{job_id}`.
2. Regardez `status`.
3. Regardez `error.code` si le job est `failed`.
4. Regardez `retry_after_at` si le job est reprogrammé.
5. Vérifiez le budget avec `GET /actions`.

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123 \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Si vous n'avez plus besoin du job :

```bash
curl https://app.yadulink.com/api/v1/jobs/job_123/cancel \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Diagnostiquer un webhook

Si votre webhook ne reçoit rien :

1. Vérifiez que le webhook est actif.
2. Envoyez un événement `test`.
3. Lisez `GET /webhooks/health`.
4. Lisez les dernières deliveries.
5. Vérifiez la signature côté serveur.
6. Vérifiez que votre endpoint répond en `2xx`.

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/test \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Que fournir au support

Pour accélérer le diagnostic, envoyez :

- l'endpoint appelé ;
- la méthode HTTP ;
- l'heure approximative ;
- le `error.code` ;
- le `job_id` si l'erreur concerne un job ;
- le `webhook_id` ou `delivery.id` si l'erreur concerne un webhook ;
- le préfixe de la clé API, jamais la clé complète ;
- la clé d'idempotence utilisée si la requête était idempotente.

Ne partagez jamais votre clé API complète.
