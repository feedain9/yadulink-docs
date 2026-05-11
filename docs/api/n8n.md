---
sidebar_position: 7
title: Utiliser Yadulink dans n8n
description: Installer et configurer l'intégration n8n Yadulink, créer une clé API, lancer des workflows, gérer les crédits, les jobs et les webhooks.
---

# Utiliser Yadulink dans n8n

n8n est l'intégration recommandée pour automatiser Yadulink sans développer une application complète. Le connecteur n8n utilise l'API Yadulink : votre compte, votre abonnement, vos crédits, vos scopes et vos limites de sécurité restent donc contrôlés par Yadulink.

## Ce que vous pouvez automatiser

Avec n8n, vous pouvez notamment :

- créer ou mettre à jour des leads depuis un formulaire, un CRM ou une base interne ;
- lire vos listes et vos leads Yadulink ;
- consulter le solde de crédits API ;
- lancer une visite de profil ;
- envoyer une demande de connexion ;
- envoyer un message à un contact éligible ;
- liker ou commenter un post ;
- suivre l'état d'un job ;
- déclencher un workflow quand un job se termine.

## Prérequis

- Un compte Yadulink actif.
- Un abonnement Yadulink actif.
- Un compte LinkedIn connecté dans Yadulink pour les actions LinkedIn.
- Des crédits API disponibles pour les actions payantes.
- Une clé API Yadulink avec les scopes nécessaires.
- Un n8n Cloud ou self-hosted avec community nodes activés si vous utilisez le node Yadulink.

## Installer le community node

Package cible :

```text
n8n-nodes-yadulink
```

Dans n8n :

1. Ouvrez **Settings**.
2. Ouvrez **Community nodes**.
3. Installez `n8n-nodes-yadulink`.
4. Redémarrez n8n si votre environnement le demande.

En self-hosted, vérifiez que les community nodes sont autorisés :

```bash
N8N_COMMUNITY_PACKAGES_ENABLED=true
```

Installation manuelle si nécessaire :

```bash
npm install n8n-nodes-yadulink
```

## Créer le credential Yadulink

1. Dans Yadulink, ouvrez **Integrations**.
2. Créez une clé API n8n quand l'option est disponible.
3. Copiez la clé.
4. Dans n8n, créez un credential `Yadulink API`.
5. Collez la clé API.
6. Gardez l'URL par défaut :

```text
https://app.yadulink.com/api/v1
```

## Tester la connexion

Ajoutez un node `Yadulink`.

Paramètres :

| Champ | Valeur |
| --- | --- |
| Resource | `Account` |
| Operation | `Get Current User` |

Si la connexion fonctionne, Yadulink renvoie les informations du compte authentifié.

Tests utiles ensuite :

| Test | Ce qu'il vérifie |
| --- | --- |
| `Account > Get Account Status` | Abonnement, éligibilité API, connexion LinkedIn |
| `Account > Get Limits` | Limites et budgets disponibles |
| `Credits > Get Balance` | Solde de crédits |
| `Account > Get Developer Manifest` | Contrat API exploitable par les utilisateurs avancés |

## Utiliser le node HTTP Request

Si une opération n'existe pas encore dans le community node, vous pouvez utiliser le node HTTP Request natif de n8n.

Configuration :

| Champ | Valeur |
| --- | --- |
| Method | Selon endpoint |
| URL | `https://app.yadulink.com/api/v1/...` |
| Authentication | Header Auth |
| Header | `Authorization: Bearer yd_votre_cle_api` |
| Body Content Type | JSON |

Le schéma OpenAPI est disponible ici :

```text
GET https://app.yadulink.com/api/v1/openapi.json
```

## Workflow recommandé : créer un lead

Cas d'usage : un formulaire ou un CRM envoie un prospect dans n8n, puis n8n crée le lead dans Yadulink.

Payload conseillé :

```json
{
  "external_id": "crm_123",
  "email": "ada@example.com",
  "list_id": 123,
  "full_name": "Ada Lovelace",
  "company_name": "Analytical Engines",
  "position": "Founder",
  "linkedin_url": "https://www.linkedin.com/in/example"
}
```

Clé d'idempotence recommandée :

```text
{{$json.external_id}}-create-lead
```

Si le CRM rejoue l'événement, Yadulink ne recrée pas un doublon.

## Workflow recommandé : lancer une action

Cas d'usage : créer un lead puis visiter son profil.

Étapes :

1. Node déclencheur : webhook n8n, CRM, Google Sheets ou autre source.
2. Node Yadulink : créer ou mettre à jour le lead.
3. Node Yadulink : `Action > Create Job`.
4. Node Wait : attendre quelques minutes si vous poller.
5. Node Yadulink : `Job > Get`.
6. Brancher selon `data.status`.

Statuts possibles :

- `queued`
- `running`
- `completed`
- `failed`
- `canceled`

Préférez un trigger webhook pour éviter de poller trop souvent.

## Workflow recommandé : recevoir les résultats par webhook

Avec `Yadulink Trigger`, vous pouvez écouter :

- `job.completed`
- `job.failed`
- `job.canceled`
- `lead.created`
- `lead.status_changed`

Le trigger crée le webhook dans Yadulink quand le workflow est activé et le supprime quand il est désactivé.

La vérification HMAC est prise en charge par le node.

## Gérer les crédits dans n8n

Avant une action en volume :

1. Utilisez `Credits > Get Balance`.
2. Utilisez `Credits > Quote Action`.
3. Comparez `total_cost` et `balance.available`.
4. Arrêtez le workflow si `can_run` vaut `false`.

Exemple de seuil :

```text
Si available < 150, arrêter le workflow et envoyer une alerte.
```

Ce contrôle évite les workflows qui échouent au milieu d'une boucle.

## Idempotence dans n8n

Utilisez une clé d'idempotence sur toute opération qui crée ou modifie quelque chose.

Exemples :

```text
{{$execution.id}}-{{$itemIndex}}-create-lead
{{$json.external_id}}-create-lead
{{$json.crm_id}}-send-message-step-1
{{$json.linkedin_url}}-profile-visit-{{$now.format("yyyy-MM-dd")}}
```

Bonnes pratiques :

- Utilisez un identifiant métier stable quand il existe.
- Ajoutez `{{$itemIndex}}` si une même exécution traite plusieurs items.
- Ne réutilisez pas la même clé pour une opération différente.
- Gardez la clé identique si vous voulez que le retry soit dédupliqué.

## Erreurs fréquentes dans n8n

| Code | Cause | Action |
| --- | --- | --- |
| `invalid_api_key` | Clé absente ou incorrecte | Vérifier le credential |
| `subscription_required` | Abonnement inactif | Réactiver Yadulink |
| `insufficient_scope` | Scope manquant | Recréer une clé avec le bon preset |
| `insufficient_api_credits` | Solde trop bas | Acheter des crédits ou réduire le volume |
| `public_action_budget_unavailable` | Budget action atteint | Ajouter un Wait ou relancer plus tard |
| `linkedin_account_required` | LinkedIn non connecté | Reconnecter LinkedIn dans Yadulink |
| `idempotency_key_reused` | Même clé avec payload différent | Corriger la clé d'idempotence |

## Checklist de production

- Tester sur un seul lead avant une boucle.
- Ajouter une clé d'idempotence à chaque mutation.
- Vérifier le solde avant les gros volumes.
- Utiliser les webhooks de jobs quand c'est possible.
- Garder la clé API dans les credentials n8n.
- Ajouter un Wait dans les boucles.
- Ne pas lancer deux workflows qui contactent le même lead en même temps.
- Prévoir une branche d'erreur pour `insufficient_api_credits` et `public_action_budget_unavailable`.
