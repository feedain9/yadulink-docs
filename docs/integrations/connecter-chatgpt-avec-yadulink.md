---
sidebar_position: 2
title: Connecter ChatGPT avec Yadulink
---

# Connecter ChatGPT avec Yadulink

Yadulink peut être connecté à ChatGPT via le serveur MCP distant Yadulink. Une fois l'app créée dans ChatGPT, tu peux demander à ChatGPT d'utiliser Yadulink pour analyser ton activité LinkedIn, préparer des briefs prospects, trouver des leads ou piloter une séquence après validation.

La principale différence avec Claude : dans ChatGPT, tu dois activer le **Mode développeur**, puis créer une app personnalisée depuis les paramètres.

:::info
Le badge du Mode développeur indique que tu ajoutes une app personnalisée. Il n'y a pas de risque particulier tant que tu utilises l'URL officielle Yadulink et que tu valides les actions importantes avant exécution.
:::

## Prérequis

- Un compte Yadulink actif.
- Ton compte LinkedIn connecté dans Yadulink.
- Un compte ChatGPT avec accès aux apps MCP et au Mode développeur.
- Une session ouverte sur `https://app.yadulink.com` au moment de l'autorisation.

:::note
Les apps MCP dans ChatGPT sont encore en bêta côté OpenAI. Selon ton plan ChatGPT et ton espace de travail, l'accès peut nécessiter un compte Business, Enterprise ou Edu, ou une activation par un administrateur.
:::

## Vérifier la connexion LinkedIn dans Yadulink

Avant de connecter ChatGPT, vérifie que LinkedIn est bien synchronisé dans Yadulink.

1. Ouvre **Yadulink > Paramètres > Système**.
2. Vérifie que ton compte LinkedIn apparaît comme connecté.
3. Si besoin, clique sur **Synchroniser** ou **Reconnecter LinkedIn**.

ChatGPT utilise Yadulink comme passerelle vers tes données et actions LinkedIn. Si LinkedIn n'est pas connecté dans Yadulink, les actions de prospection ne pourront pas fonctionner correctement.

## Connexion pas à pas

### Étape 1 - Ouvrir les paramètres ChatGPT

Dans ChatGPT, clique sur ton profil en bas à droite, puis clique sur **Paramètres**.

### Étape 2 - Ouvrir Applications

Dans la fenêtre des paramètres, clique sur **Applications**.

Selon la langue de ton interface, cette section peut aussi s'appeler **Apps**.

### Étape 3 - Ouvrir les paramètres avancés

Dans **Applications**, clique sur **Paramètres avancés**.

### Étape 4 - Activer le Mode développeur

Active le **Mode développeur**.

Le badge ou l'avertissement affiché par ChatGPT sert à signaler que tu peux créer et tester des apps personnalisées. Pour Yadulink, garde simplement l'URL officielle du serveur MCP :

```text
https://mcp.yadulink.com/mcp/
```

### Étape 5 - Créer une app

Clique sur **Créer une appli**.

Renseigne au minimum :

| Champ | Valeur |
| --- | --- |
| Nom | `Yadulink` |
| URL du serveur MCP | `https://mcp.yadulink.com/mcp/` |
| Authentification | OAuth |

### Étape 6 - Confirmer la création

Coche **J'ai compris et je souhaite continuer**, puis clique sur **Créer**.

### Étape 7 - Autoriser Yadulink

ChatGPT lance ensuite le flux OAuth.

1. Connecte-toi à Yadulink si ce n'est pas déjà fait.
2. Vérifie le compte utilisé.
3. Autorise l'accès demandé.
4. Reviens dans ChatGPT.

Une fois l'autorisation terminée, l'app Yadulink apparaît dans tes applications activées.

## Tester la connexion

Dans une nouvelle conversation ChatGPT, active l'app Yadulink si elle n'est pas déjà disponible, puis teste avec un prompt simple :

```text
Utilise Yadulink pour résumer mes priorités de contact aujourd'hui.
```

Tu peux ensuite tester une demande plus opérationnelle :

```text
Utilise Yadulink pour trouver 100 agences marketing à Paris, cibler les fondateurs, importer les contacts dans une liste, puis attendre ma validation avant de lancer une séquence.
```

## Ce que ChatGPT peut faire avec Yadulink

Selon les autorisations disponibles sur ton compte, ChatGPT peut notamment :

- lire l'état de ton compte Yadulink et de ta connexion LinkedIn ;
- analyser tes messages, visites, invitations et taux de réponse ;
- préparer un brief prospect avant une réponse ;
- repérer les opportunités chaudes oubliées ;
- prévisualiser une recherche LinkedIn avant import ;
- créer une liste de contacts et préparer une séquence si tu le demandes explicitement ;
- analyser les performances d'une séquence et proposer des améliorations.

## Bonnes pratiques

- Demande une prévisualisation avant tout import de contacts.
- Valide explicitement avant de lancer une séquence ou une action d'écriture.
- Garde le connecteur limité à l'URL officielle `https://mcp.yadulink.com/mcp/`.
- Désactive l'app dans les conversations qui n'ont pas besoin d'accéder à Yadulink.

## Résoudre les problèmes courants

### Je ne vois pas le Mode développeur

Vérifie que ton plan ChatGPT et ton espace de travail permettent les apps MCP. Sur certains espaces Business, Enterprise ou Edu, un administrateur doit activer l'accès.

### ChatGPT refuse de créer l'app

Vérifie que l'URL du serveur MCP est exactement :

```text
https://mcp.yadulink.com/mcp/
```

Vérifie aussi que l'authentification est bien réglée sur **OAuth**.

### L'autorisation Yadulink ne se termine pas

Reconnecte-toi sur `https://app.yadulink.com`, puis relance la connexion depuis ChatGPT.

### ChatGPT indique que LinkedIn n'est pas connecté

Retourne dans **Yadulink > Paramètres > Système** et clique sur **Reconnecter LinkedIn**.
