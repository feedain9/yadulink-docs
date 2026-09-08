---
sidebar_position: 8
title: Limites et quotas
description: Comprendre les limites de débit de l'API Yadulink, les budgets de sécurité des actions LinkedIn et la différence avec les crédits API.
---

# Limites et quotas

Trois mécanismes différents peuvent refuser un appel. Ils ne se remplacent pas et ne se compensent pas.

| Mécanisme | Ce qu'il protège | Erreur renvoyée |
| --- | --- | --- |
| Limite de débit | La plateforme Yadulink | `rate_limit_exceeded` (429) |
| Budget d'action | Votre compte LinkedIn | `public_action_budget_unavailable` (429) |
| Crédits API | Votre consommation | `insufficient_api_credits` (403) |

## Limite de débit

Chaque clé API dispose de **100 requêtes par minute**. La fenêtre est calée sur la minute d'horloge, pas glissante : le compteur repart à zéro au changement de minute.

Quand la limite est atteinte, l'API renvoie `429` avec l'en-tête `Retry-After` indiquant le nombre de secondes jusqu'à la fenêtre suivante.

```json
{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Limit: 100 requests/minute"
  }
}
```

La limite courante de votre clé est affichée sur sa fiche dans **Integrations > API > Clés API > Gérer**.

:::tip
Dans n8n, préférez le batching et un délai entre les items plutôt que des appels en parallèle. Une boucle qui traite 500 leads sans pause atteint la limite en quelques secondes ; la même boucle avec un `Wait` de 1 seconde ne l'atteint jamais.
:::

## Budgets de sécurité des actions LinkedIn

Les actions LinkedIn ont leur propre budget, indépendant du solde de crédits. Il protège votre compte LinkedIn d'un workflow qui boucle.

| Opération | Par jour | Par semaine | Intervalle minimum |
| --- | ---: | ---: | ---: |
| `profile_visit` | 80 | — | 120 s |
| `post_like` | 80 | — | 60 s |
| `post_comment` | 80 | — | 90 s |
| `send_connection_request` | 60 | 200 | 90 s |
| `send_message` | 80 | — | 60 s |

Ces valeurs sont exposées en direct par `GET /actions`, qui renvoie aussi l'état courant du budget pour chaque opération. Interrogez-le avant un traitement en volume plutôt que de découvrir la limite au milieu de la boucle.

```bash
curl https://app.yadulink.com/api/v1/actions \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Quand un budget est indisponible, la création du job échoue avec `public_action_budget_unavailable` et le job n'est pas créé : aucun crédit n'est réservé.

## Crédits

Les crédits sont un compteur de consommation, pas une limite de débit. Un solde suffisant n'autorise pas à dépasser la limite de requêtes, et une limite de requêtes respectée ne dispense pas d'avoir des crédits.

Voir [Crédits API](/api/credits-api/) pour le détail du barème et du cycle réservation / consommation / remboursement.

## Diagnostiquer un refus

1. Lisez `error.code` : les trois mécanismes ont chacun le leur.
2. Sur un `429`, respectez `Retry-After` avant de réessayer.
3. Conservez l'en-tête `X-Request-ID` de la réponse : c'est l'identifiant que le support utilise pour retrouver l'appel.
4. Pour un budget d'action, lisez `GET /actions` pour savoir quand la fenêtre se rouvre.
