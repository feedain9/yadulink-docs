// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Bienvenue',
    },
    {
      type: 'category',
      label: 'Pour commencer',
      collapsible: true,
      collapsed: false,
      items: [
        'pour-commencer/presentation-de-yadulink',
        'pour-commencer/installer-extension-chrome',
        'pour-commencer/synchroniser-compte-linkedin',
        'pour-commencer/configurer-ton-ciblage',
        'pour-commencer/configurer-horaires-de-travail',
      ],
    },
    {
      type: 'category',
      label: 'Liste de contacts',
      collapsible: true,
      collapsed: true,
      items: [
        'liste-de-contacts/introduction',
        'liste-de-contacts/depuis-un-fichier',
        'liste-de-contacts/depuis-un-profil',
        'liste-de-contacts/depuis-une-publication',
        'liste-de-contacts/depuis-une-recherche',
        'liste-de-contacts/depuis-un-evenement',
        'liste-de-contacts/depuis-un-groupe',
        'liste-de-contacts/depuis-un-compte-entreprise',
        'liste-de-contacts/depuis-sales-navigator',
        'liste-de-contacts/depuis-ton-reseau',
        'liste-de-contacts/partager-une-liste',
        'liste-de-contacts/exporter-une-liste',
      ],
    },
    {
      type: 'category',
      label: 'Automatisations',
      collapsible: true,
      collapsed: true,
      items: [
        'automatisations/introduction',
        'automatisations/creer-une-sequence',
        'automatisations/vues-du-profil',
        'automatisations/invitations-recues',
        'automatisations/likes-et-commentaires',
      ],
    },
    {
      type: 'category',
      label: 'Publications',
      collapsible: true,
      collapsed: true,
      items: [
        'publications/introduction',
        'publications/rediger-et-programmer',
        'publications/analyser-performances',
      ],
    },
    {
      type: 'category',
      label: 'IA',
      collapsible: true,
      collapsed: true,
      items: [
        'ia/introduction',
        'ia/generer-commentaire',
        'ia/generer-reponse-message',
        'ia/parametrer-ia-messages',
        'ia/generer-message-profil',
        'ia/generer-message-publication',
        'ia/templates-introduction',
        'ia/creer-template',
        'ia/utiliser-template',
      ],
    },
    {
      type: 'category',
      label: 'Fils d\'actus',
      collapsible: true,
      collapsed: true,
      items: [
        'fils-dactus/introduction',
        'fils-dactus/creer-fil-dactu',
      ],
    },
    {
      type: 'category',
      label: 'Cas d\'usage',
      collapsible: true,
      collapsed: true,
      items: [
        'cas-dusage/envoyer-lead-magnet',
      ],
    },
    {
      type: 'category',
      label: 'Bugs & erreurs',
      collapsible: true,
      collapsed: true,
      items: [
        'bugs-erreurs/yadulink-commentaire',
      ],
    },
  ],
};

export default sidebars;
