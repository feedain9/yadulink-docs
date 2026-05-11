---
sidebar_position: 6
title: Webhooks
description: Configurer les webhooks Yadulink, recevoir les événements, vérifier la signature HMAC, comprendre les retries et rejouer une livraison.
---

# Webhooks

Les webhooks permettent à Yadulink d'envoyer un événement vers votre outil quand quelque chose se produit : création de lead, changement de statut ou fin de job.

Ils sont utiles pour :

- déclencher un workflow n8n ;
- mettre à jour un CRM ;
- recevoir le résultat d'un job sans polling ;
- auditer les événements Yadulink dans un système externe.

## Événements disponibles

| Événement | Quand il est envoyé |
| --- | --- |
| `lead.created` | Un lead est créé |
| `lead.status_changed` | Le statut d'un lead change |
| `job.completed` | Un job API réussit |
| `job.failed` | Un job API échoue définitivement |
| `job.canceled` | Un job API est annulé |
| `test` | Événement de test |

## Créer un webhook

```bash
curl https://app.yadulink.com/api/v1/webhooks \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/yadulink/webhook",
    "events": ["job.completed", "job.failed", "job.canceled"],
    "description": "Webhook production n8n"
  }'
```

Réponse typique :

```json
{
  "success": true,
  "data": {
    "id": 456,
    "url": "https://example.com/yadulink/webhook",
    "events": ["job.completed", "job.failed", "job.canceled"],
    "active": true,
    "secret": "whsec_xxx"
  },
  "meta": {}
}
```

:::warning
Le secret de signature doit être stocké comme un secret. Ne l'exposez pas dans un navigateur ou dans un log.
:::

## Payload reçu

Exemple de payload :

```json
{
  "id": "evt_xxx",
  "event": "job.completed",
  "api_version": "v1",
  "schema_version": "2026-05-11",
  "created_at": "2026-05-11T10:30:00Z",
  "timestamp": "2026-05-11T10:30:00Z",
  "delivery": {
    "id": 123,
    "attempt": 1,
    "max_attempts": 5,
    "webhook_id": 456
  },
  "account": {
    "user_id": 789,
    "email": "user@example.com"
  },
  "data": {
    "job_id": "job_123",
    "operation": "send_message",
    "status": "completed"
  }
}
```

Identifiants importants :

| Champ | Usage |
| --- | --- |
| `id` | Identifiant stable de l'événement métier |
| `delivery.id` | Identifiant de la tentative de livraison |
| `delivery.attempt` | Numéro de tentative |
| `api_version` | Version de l'API qui produit l'événement |
| `schema_version` | Version du schéma de payload |

Si Yadulink retente une livraison, `id` reste identique. Utilisez-le pour dédupliquer côté client.

## Headers envoyés

Yadulink ajoute des headers utiles :

```http
X-Yadulink-Event: job.completed
X-Yadulink-Event-Id: evt_xxx
X-Yadulink-Webhook-Id: 456
X-Yadulink-Delivery-Id: 123
X-Yadulink-Delivery-Attempt: 1
X-Yadulink-Api-Version: v1
X-Yadulink-Schema-Version: 2026-05-11
X-Yadulink-Signature: t=...,v1=...
```

## Vérifier la signature

Yadulink signe le corps exact de la requête avec HMAC-SHA256.

Header :

```http
X-Yadulink-Signature: t=timestamp,v1=signature
```

Payload signé :

```text
timestamp.raw_json_payload
```

Exemple Node.js :

```js
import crypto from "node:crypto";

function verifyYadulinkSignature({ rawBody, signatureHeader, secret }) {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => part.split("="))
  );

  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  if (signature.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expected, "hex")
  );
}
```

:::warning
Vérifiez la signature sur le corps brut, avant parsing JSON. Si votre framework modifie le body avant vérification, la signature ne correspondra plus.
:::

## Retries

Yadulink retente automatiquement les erreurs temporaires :

- timeout ;
- erreur réseau ;
- HTTP `408` ;
- HTTP `409` ;
- HTTP `425` ;
- HTTP `429` ;
- HTTP `5xx`.

Yadulink ne retente pas les erreurs considérées comme non récupérables :

- HTTP `400` ;
- HTTP `401` ;
- HTTP `403` ;
- HTTP `404` ;
- HTTP `410`.

La politique de retry utilise un backoff exponentiel jusqu'à 5 tentatives.

## Santé des webhooks

Lire l'état :

```bash
curl https://app.yadulink.com/api/v1/webhooks/health \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Le payload expose les endpoints à surveiller, les compteurs d'échec et les dernières deliveries en erreur.

Si un endpoint échoue trop souvent, Yadulink peut le désactiver automatiquement pour éviter une boucle d'échecs.

Pour réactiver :

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/activate \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api"
```

## Tester un webhook

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/test \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Yadulink envoie un événement `test`.

## Rejouer une livraison

1. Listez les deliveries :

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/deliveries \
  -H "Authorization: Bearer yd_votre_cle_api"
```

2. Rejouez une tentative précise :

```bash
curl https://app.yadulink.com/api/v1/webhooks/456/deliveries/123/replay \
  -X POST \
  -H "Authorization: Bearer yd_votre_cle_api"
```

Le replay garde le même `id` d'événement métier, ce qui permet de dédupliquer côté client.

## n8n

Avec le community node Yadulink, utilisez de préférence `Yadulink Trigger`. Il crée et supprime le webhook automatiquement quand le workflow est activé ou désactivé, et vérifie la signature HMAC.
