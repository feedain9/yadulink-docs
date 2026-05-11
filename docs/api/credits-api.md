---
sidebar_position: 3
title: Crédits API
description: Comprendre le fonctionnement des crédits API Yadulink, les coûts par action, la réservation, le débit, le remboursement et l'historique.
---

# Crédits API

Les crédits API mesurent la consommation des actions lancées depuis l'API ou depuis des intégrations comme n8n. Ils permettent d'ouvrir une surface d'automatisation puissante sans rendre l'usage illimité.

Un abonnement Yadulink actif reste nécessaire. Les crédits donnent le droit de consommer des actions API, mais ils ne remplacent pas l'abonnement.

## Ce qui est gratuit

Les appels de lecture simples sont gratuits au départ :

- tester une clé avec `GET /me` ;
- lire le statut du compte ;
- lire les limites ;
- lire le solde de crédits ;
- lire les listes et les leads déjà présents ;
- lire le statut d'un job ;
- lire ou gérer les webhooks.

## Ce qui consomme des crédits

Les mutations et les actions à valeur consomment des crédits.

| Opération | Coût |
| --- | ---: |
| `lead_create` | 1 crédit |
| `lead_update` | 1 crédit |
| `lead_delete` | 1 crédit |
| `list_create` | 1 crédit |
| `list_update` | 1 crédit |
| `list_delete` | 1 crédit |
| `profile_visit` | 2 crédits |
| `post_like` | 2 crédits |
| `post_comment` | 8 crédits |
| `send_connection_request` | 10 crédits |
| `send_message` | 10 crédits |
| `sequence_create` | 5 crédits |

:::note
La grille peut évoluer pour les nouveaux endpoints. Le coût exact exposé par l'API fait foi, notamment via `GET /developer/manifest`, `GET /actions` et `POST /credits/quote`.
:::

## Solde disponible et crédits réservés

Le solde distingue deux valeurs importantes :

| Champ | Sens |
| --- | --- |
| `available` | Crédits prêts à être utilisés |
| `reserved` | Crédits bloqués par des jobs en attente ou en cours |
| `included_monthly` | Crédits inclus encore disponibles sur le cycle en cours |
| `purchased` | Crédits achetés encore disponibles |
| `used_this_cycle` | Crédits consommés sur le cycle courant |

Exemple :

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

## Comment les crédits sont consommés

Yadulink utilise un modèle de wallet, buckets et ledger.

| Élément | Rôle |
| --- | --- |
| Wallet | Solde global du compte |
| Bucket | Groupe de crédits selon son origine et son expiration |
| Ledger | Historique append-only de chaque mouvement |

Les crédits peuvent venir de plusieurs origines : crédits inclus, crédits achetés, crédits offerts ou crédits remboursés. Quand une action consomme des crédits, Yadulink prend en priorité les crédits utilisables qui expirent le plus tôt. Cela évite de garder des crédits proches de l'expiration pendant que des crédits plus récents sont consommés.

Chaque mouvement est inscrit dans le ledger :

| Type | Sens |
| --- | --- |
| `grant` | Ajout de crédits inclus, achetés ou offerts |
| `reserve` | Réservation pour un job asynchrone |
| `commit` | Consommation confirmée |
| `refund` | Remboursement d'une réservation |
| `expire` | Expiration d'un bucket |
| `adjustment` | Ajustement manuel |

## Appels synchrones

Pour une mutation simple, par exemple créer un lead :

1. Yadulink valide la clé, les scopes, l'abonnement et le payload.
2. Yadulink exécute la mutation.
3. Si la mutation réussit, Yadulink débite les crédits.
4. Si la mutation échoue, les crédits ne sont pas débités.

Exemple : `POST /leads` coûte 1 crédit si le lead est bien créé.

## Jobs asynchrones

Les actions LinkedIn sensibles passent par des jobs, par exemple envoyer une demande de connexion.

Cycle d'un job :

1. Vous créez le job.
2. Yadulink réserve les crédits nécessaires.
3. Le job passe en `queued`, puis `running`.
4. Si l'action réussit, la réservation est confirmée.
5. Si l'action échoue définitivement ou est annulée, la réservation est remboursée.
6. Si l'action est reprogrammée automatiquement, les crédits restent réservés jusqu'au résultat final.

Cette mécanique évite de lancer des actions sans solde, tout en évitant de facturer définitivement une action qui n'a pas abouti.

## Idempotence et crédits

L'idempotence protège aussi votre solde.

Si vous rejouez une requête avec la même clé d'idempotence, le même chemin et le même payload, Yadulink renvoie la première réponse sans recréer une action et sans redébiter les crédits.

Si vous réutilisez la même clé pour un payload différent, Yadulink renvoie `idempotency_key_reused`.

## Estimer un coût

Utilisez `POST /credits/quote` avant de lancer un volume.

```bash
curl https://app.yadulink.com/api/v1/credits/quote \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "send_message",
    "quantity": 25
  }'
```

Réponse :

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

## Lire l'historique

```bash
curl "https://app.yadulink.com/api/v1/credits/ledger?page=1&per_page=50" \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Filtres utiles :

| Paramètre | Exemple |
| --- | --- |
| `entry_type` | `commit`, `reserve`, `refund` |
| `operation` | `send_message`, `lead_create` |
| `page` | `1` |
| `per_page` | `50` |

## Packs de crédits

Les packs disponibles sont affichés dans l'application et exposés par `GET /credits/packs`.

Exemples de packs :

| Pack | Crédits | Prix indicatif |
| --- | ---: | ---: |
| 1 000 crédits API | 1 000 | 50 EUR |
| 10 000 crédits API | 10 000 | 200 EUR |
| Pack custom | Sur devis | Sur devis |

Le checkout d'un pack démarre depuis une session Yadulink authentifiée, pas depuis une clé API seule.

## Solde insuffisant

Si le solde disponible est trop bas, Yadulink renvoie :

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

Dans n8n, traitez ce cas explicitement : arrêtez le workflow, envoyez une alerte ou réduisez le volume.
