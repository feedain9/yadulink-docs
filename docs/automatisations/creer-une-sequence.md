---
sidebar_position: 2
title: Créer une séquence de prospection
---

# Créer une séquence de prospection

:::info
La création d'une séquence de prospection nécessite une liste de contacts prête avec au moins un contact à exploiter. Si tu n'as pas encore de liste de contacts prête, tu peux le faire [ici](/liste-de-contacts/introduction/).
:::

Une séquence de prospection est une suite d'actions automatisées qui imite au maximum le comportement humain pour contacter à grande échelle un grand nombre de personnes afin de parler de tes services à l'aide de l'automatisation.

**Exemple** : Martine est assistante virtuelle pour les artisans du BTP, elle va trouver des artisans du BTP et les contacter à grande échelle pour leur parler de ses services.

Sauf que pour paraître naturel et humain, il ne faut pas directement attaquer en envoyant un message 😅

À la place, on va utiliser l'automatisation pour surveiller les dernières publications des contacts pour aller liker (et commenter) pour montrer notre intérêt, puis on va visiter le profil pour être sûr que le contact nous a vu à différents endroits (sous son post, et dans ses vues de profil). On va l'ajouter dans notre réseau et lui envoyer un message.

## Oui, mais concrètement comment on fait ?

C'est parti, commence par te rendre sur la section **Automatisations** sur Yadulink.

1. **Donne un nom à ta séquence**

2. **Choisis la liste de contacts** à exploiter pour cette séquence

3. **Choisis le type de parcours** à effectuer (on te recommande la troisième option)

4. **Coche que tu n'as pas d'autres outils d'automatisation** de prospection connecté à ton compte LinkedIn

5. Clique sur **Suivant**

![Création d'une séquence - Étape 1](/img/automatisations/sequence-step1.png)

:::note
On préfère avoir ta confirmation que tu n'as pas d'outils d'automatisation de prospection tiers connecté à ton LinkedIn afin d'éviter le bannissement de ton compte.
:::

## Configuration des étapes

Ensuite, selon le type d'étape et parcours choisi, tu dois effectuer certaines configurations :

### Commentaires automatiques

Configure le type de commentaires que tu veux que Yadulink rédige sous les posts récents des profils de la liste de contacts puis clique sur **Suivant**.

![Configuration des commentaires](/img/automatisations/sequence-step2.png)

### Note de connexion

Si tu le souhaites, tu peux ajouter une note à ta demande de connexion. Une prévisualisation est ajoutée juste à côté pour que tu puisses voir comment le contact va recevoir ta demande de connexion. Une fois choisi, clique sur **Suivant**.

![Note de connexion](/img/automatisations/sequence-step3.png)

### Premier message

Tu peux maintenant configurer le premier message que le contact va recevoir. Une variable `{{first_name}}` est à ta disposition pour personnaliser le message sur chaque profil.

Tu peux préparer deux versions de ton message (A et B) pour voir lequel des deux aura un meilleur taux de réponses.

Une prévisualisation est ajoutée juste à côté pour que tu puisses voir comment le contact va recevoir ton message. Une fois rédigé, clique sur **Suivant**.

![Premier message](/img/automatisations/sequence-step4.png)

### Message de relance

On arrive à la dernière étape de configuration : le message de relance. Il sera envoyé uniquement si le prospect n'a pas répondu au premier message envoyé juste avant.

Tout comme l'étape précédente, tu peux utiliser la variable `{{first_name}}` pour personnaliser le message de relance, et une prévisualisation pour voir comment le contact va recevoir ton message. Une fois rédigé, clique sur **Suivant**.

## Vérification et lancement

La dernière étape est la phase de vérification durant laquelle tu vas vérifier les délais d'attente entre chaque étape avant de lancer ta séquence.

Par exemple, tu peux voir qu'un jour après l'étape "Visiter le profil", on passe à "Liker le post", et ainsi de suite...

Une fois que c'est prêt, clique sur **Enregistrer et démarrer la séquence**.

![Vérification et lancement](/img/automatisations/sequence-step5.png)

## Après le lancement

Une fois démarrée, tu as plusieurs informations à ta disposition :

- Les jours d'activités et la plage horaire d'exécution
- Le démarrage de la première action (généralement entre 10 et 30 minutes après le démarrage)
- Le choix de recevoir un email dès que la séquence est terminée

:::tip
Le temps de démarrage d'une séquence va dépendre du nombre d'étapes qu'elle possède et le nombre de profils dans la liste de contacts. Plus ces chiffres sont grands, plus elle mettra du temps.
:::
