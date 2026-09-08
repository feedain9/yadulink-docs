---
sidebar_position: 1
title: API Yadulink
description: Comprendre l'API Yadulink, son versioning, son modèle de crédits, ses prérequis et les premières étapes pour connecter Yadulink à vos outils.
---

# API Yadulink

L'API Yadulink permet de connecter Yadulink à vos outils internes, à n8n, à un CRM, à un produit métier ou à un système d'automatisation. Elle permet de lire vos données Yadulink, de synchroniser des leads, de lancer des actions LinkedIn sous forme de jobs et de recevoir des événements par webhook.

L'accès API repose sur trois règles simples :

- Un compte Yadulink actif est obligatoire.
- Les actions à valeur consomment des crédits API.
- Les actions LinkedIn sensibles passent par des jobs asynchrones avec des limites de sécurité.

:::info
L'API est disponible avec un abonnement Yadulink actif. Elle se pilote depuis **Integrations > API**, où vous trouvez vos clés, votre solde de crédits et votre consommation.
:::

## URL de base

L'API publique de production est disponible à cette adresse :

```text
https://app.yadulink.com/api/v1
```

Exemple :

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Versioning

L'API est versionnée dans l'URL.

| Version | Statut | URL |
| --- | --- | --- |
| `v1` | Version courante | `https://app.yadulink.com/api/v1` |

Yadulink applique ces principes :

- Les ajouts compatibles restent dans `/api/v1`.
- Un nouveau champ peut être ajouté sans changer de version.
- Un champ existant ne change pas de type ou de sens sans nouvelle version.
- Une suppression ou une modification incompatible passe par une nouvelle version, par exemple `/api/v2`.
- Les webhooks contiennent aussi `api_version` et `schema_version` pour versionner les payloads reçus.

## Format des réponses

Toutes les réponses réussies suivent ce format :

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Toutes les erreurs suivent ce format :

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

Le champ `error.code` est stable et peut être utilisé dans vos workflows n8n ou dans votre code.

## Ce que l'API permet de faire

| Domaine | Exemples |
| --- | --- |
| Compte | Tester la clé, lire le statut du compte, vérifier l'abonnement et LinkedIn |
| Crédits | Lire le solde, consulter l'historique, estimer le coût d'une opération |
| Listes | Lister, créer, modifier et supprimer des listes |
| Leads | Rechercher, créer, modifier et supprimer des leads |
| Messages | Lire les messages disponibles et lancer des jobs d'envoi |
| Actions LinkedIn | Visiter un profil, liker, commenter, envoyer une invitation, envoyer un message |
| Jobs | Suivre, annuler et diagnostiquer les actions asynchrones |
| Webhooks | Recevoir des événements `lead.*`, `job.*` et tester les livraisons |
| n8n | Utiliser Yadulink depuis des workflows no-code ou low-code |

## Prérequis

Avant d'utiliser l'API :

- Votre compte Yadulink doit avoir un abonnement actif.
- Votre compte LinkedIn doit être connecté dans Yadulink pour les actions LinkedIn.
- Vous devez créer une clé API depuis la page **Integrations** quand l'accès API est disponible sur votre compte.
- Votre clé doit avoir les scopes nécessaires.
- Votre solde doit contenir assez de crédits pour les actions payantes.

## Première requête

Utilisez `GET /me` pour vérifier que votre clé fonctionne :

```bash
curl https://app.yadulink.com/api/v1/me \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Réponse typique :

```json
{
  "success": true,
  "data": {
    "id": 123,
    "email": "user@example.com",
    "first_name": "Ada",
    "last_name": "Lovelace",
    "api_access": {
      "eligible": true
    }
  }
}
```

`GET /me` ne consomme aucun crédit : c'est le test à lancer en premier quand une intégration ne répond plus.

## Documentation machine-readable

Deux endpoints sont utiles pour les outils avancés :

| Endpoint | Usage |
| --- | --- |
| `GET /openapi.json` | Schéma OpenAPI de l'API publique |
| `GET /developer/manifest` | Contrat Yadulink enrichi avec crédits, scopes, actions et webhooks |

Le schéma OpenAPI sert notamment avec le node HTTP Request de n8n, des outils de test API ou des générateurs de clients.

La [**référence OpenAPI**](/api/reference/) de cette documentation est générée depuis ce schéma : c'est la liste qui fait foi pour les paramètres, les corps de requête et les codes de réponse.

Chaque réponse porte un en-tête `X-Request-ID`. Conservez-le dans vos logs : c'est l'identifiant que le support utilise pour retrouver un appel précis. Si vous envoyez le vôtre, Yadulink le réutilise.

## Guides à lire ensuite

- [Authentification et clés API](/api/authentification-et-cles-api/)
- [Crédits API](/api/credits-api/)
- [Référence des endpoints](/api/endpoints/)
- [Actions et jobs](/api/actions-et-jobs/)
- [Webhooks](/api/webhooks/)
- [Limites et quotas](/api/limites-et-quotas/)
- [Utiliser Yadulink dans n8n](/api/n8n/)
- [Référence OpenAPI générée](/api/reference/)
