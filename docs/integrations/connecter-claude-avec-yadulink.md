---
sidebar_position: 1
title: Connecter Claude avec Yadulink
---

# Connecter Claude avec Yadulink

Yadulink expose un serveur MCP distant qui permet à Claude d'accéder à tes données Yadulink et de piloter tes actions de prospection LinkedIn depuis une conversation Claude.

Une fois le connecteur activé, tu peux demander à Claude de préparer un brief prospect, analyser tes séquences, repérer les priorités de contact du jour ou lancer une recherche de leads structurée dans Yadulink.

## Pourquoi connecter Claude à Yadulink ?

Quand tu prospectes sur LinkedIn, tu dois souvent passer d'une étape à l'autre manuellement : trouver les bons profils, construire une liste, identifier les signaux utiles, écrire un message, suivre les réponses, puis comprendre ce qui a fonctionné.

Avec Claude connecté à Yadulink, tu peux piloter ce travail depuis une conversation. Claude garde le contexte, appelle les outils Yadulink quand c'est nécessaire et t'aide à transformer une intention de prospection en action concrète.

## Prérequis

- Un compte Yadulink actif.
- Ton compte LinkedIn connecté dans Yadulink.
- Un compte Claude avec accès aux connecteurs personnalisés.
- Une session ouverte sur `https://app.yadulink.com` au moment de l'autorisation.

:::info
Le connecteur utilise OAuth. Claude te redirige vers Yadulink pour autoriser l'accès, puis récupère uniquement les données et actions disponibles pour ton compte.
:::

## Vérifier la connexion LinkedIn dans Yadulink

Avant de connecter Claude, assure-toi que LinkedIn est bien synchronisé dans Yadulink.

1. Ouvre **Yadulink > Paramètres > Système**.
2. Vérifie que ton compte LinkedIn apparaît comme connecté.
3. Si besoin, clique sur **Synchroniser** ou **Reconnecter LinkedIn**.

Cette étape est importante : Claude utilise Yadulink comme passerelle. Si LinkedIn n'est pas connecté dans Yadulink, Claude ne pourra pas préparer correctement tes actions de prospection.

## Connexion pas à pas

### Étape 1 - Ouvrir Claude

Rends-toi sur [claude.ai](https://claude.ai/) ou ouvre Claude Desktop.

### Étape 2 - Ouvrir les connecteurs

Dans Claude, ouvre **Paramètres > Connecteurs**.

Sur un compte Team ou Enterprise, le propriétaire de l'espace peut devoir ajouter le connecteur côté organisation avant que chaque utilisateur puisse se connecter individuellement.

### Étape 3 - Ajouter Yadulink

Dans Claude, ajoute un connecteur personnalisé avec les informations suivantes :

| Champ | Valeur |
| --- | --- |
| Nom du connecteur | `Yadulink` |
| URL du connecteur | `https://mcp.yadulink.com/mcp/` |
| Authentification | OAuth |

Laisse les champs avancés OAuth vides si Claude les affiche : Yadulink supporte l'enregistrement dynamique du client OAuth.

### Étape 4 - Connecter ton compte Yadulink

Après l'ajout du connecteur, clique sur **Connecter** dans Claude.

Claude ouvre une page d'autorisation Yadulink.

### Étape 5 - Accepter la connexion

1. Connecte-toi à Yadulink si ce n'est pas déjà fait.
2. Vérifie le compte utilisé.
3. Autorise l'accès demandé.

### Étape 6 - Revenir dans Claude

Quand l'autorisation est terminée, le connecteur Yadulink apparaît comme connecté dans Claude.

### Étape 7 - Vérifier l'état du connecteur

Dans Claude, vérifie que le connecteur est disponible. Le bouton peut passer en **Configurer** ou afficher l'état connecté selon l'interface Claude.

### Étape 8 - Tester avec un premier prompt

Commence par une demande simple, puis valide les actions importantes avant exécution :

```text
Utilise le connecteur Yadulink pour trouver 100 agences marketing à Paris, cibler les fondateurs, importer les contacts dans une liste, puis attendre ma validation avant de lancer une séquence.
```

## Activer le connecteur dans une conversation

Dans une nouvelle conversation Claude :

1. Clique sur le bouton **+** ou sur le menu des outils.
2. Ouvre **Connecteurs**.
3. Active **Yadulink** pour la conversation.

Claude peut maintenant appeler les outils Yadulink quand ta demande le nécessite.

## Exemples de demandes utiles

Tu peux commencer avec des prompts simples :

```text
Résume mes priorités de contact Yadulink pour aujourd'hui.
```

```text
Prépare un brief sur ce prospect avant que je lui réponde : [nom ou URL LinkedIn].
```

```text
Analyse les fuites de mes séquences sur les 30 derniers jours et propose les trois actions les plus importantes.
```

```text
Trouve des VP Sales dans des SaaS B2B en France, prévisualise la recherche, puis attends ma validation avant l'import.
```

```text
À partir de mes meilleures conversations, déduis l'ICP qui répond le mieux et propose une nouvelle recherche LinkedIn.
```

## Ce que Claude peut faire avec Yadulink

Selon les autorisations de ton compte, Claude peut notamment :

- lire ton profil Yadulink et l'état de connexion LinkedIn ;
- résumer tes statistiques de messages, visites, connexions et taux de réponse ;
- préparer un brief avant une conversation avec un prospect ;
- trouver des opportunités chaudes oubliées ;
- repérer les fuites dans ton pipeline de prospection ;
- prévisualiser une recherche de leads avant import ;
- créer une liste de contacts et lancer une séquence si tu le demandes explicitement ;
- proposer des améliorations ou des tests A/B sur une séquence existante.

## Bonnes pratiques

- Demande toujours une prévisualisation avant de lancer un import ou une séquence.
- Donne à Claude un ICP clair : rôle, secteur, zone géographique, taille d'entreprise et signaux à exclure.
- Vérifie les actions d'écriture avant de les valider.
- Désactive le connecteur dans les conversations qui n'ont pas besoin d'accéder à Yadulink.

## Résoudre les problèmes courants

### Claude ne voit pas le connecteur

Vérifie que le connecteur est bien ajouté dans **Paramètres > Connecteurs**, puis active-le dans la conversation en cours.

### L'autorisation tourne en boucle

Reconnecte-toi sur `https://app.yadulink.com`, puis relance la connexion depuis Claude.

### Claude indique que LinkedIn n'est pas connecté

Retourne dans **Yadulink > Paramètres > Système** et clique sur **Reconnecter LinkedIn**.

### Claude Desktop ne fonctionne pas avec `claude_desktop_config.json`

Pour le serveur MCP distant de Yadulink, ajoute le connecteur depuis **Paramètres > Connecteurs** dans Claude. Le fichier `claude_desktop_config.json` sert aux serveurs MCP locaux, pas à ce connecteur distant.

## Vidéo de démonstration

<iframe
  width="100%"
  height="420"
  src="https://www.youtube.com/embed/pauObl0A-O0"
  title="Connecter Claude avec Yadulink"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
/>
