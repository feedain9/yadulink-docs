// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Accueil',
    },
    {
      type: 'doc',
      id: 'demarrage-rapide',
      label: 'Démarrage rapide',
    },
    {
      type: 'category',
      label: 'Automatisations',
      collapsible: true,
      collapsed: false,
      items: [
        'automatisations/introduction-aux-automatisations',
        'automatisations/creer-une-automatisation',
        'automatisations/types-etapes',
        'automatisations/parametres-avances',
      ],
    },
    {
      type: 'category',
      label: 'Fils d\'actu',
      collapsible: true,
      collapsed: true,
      items: [
        'fils-dactus/comment-creer-un-fil-dactu',
        'fils-dactus/filtrer-votre-fil',
        'fils-dactus/interagir-avec-les-posts',
      ],
    },
    {
      type: 'category',
      label: 'Publications',
      collapsible: true,
      collapsed: true,
      items: [
        'publications/comment-rediger-et-programmer',
        'publications/planifier-vos-posts',
        'publications/analyser-performances',
      ],
    },
    {
      type: 'category',
      label: 'IA',
      collapsible: true,
      collapsed: true,
      items: [
        'ia/comment-generer-un-commentaire',
        'ia/comment-generer-une-reponse-a-un-message',
        'ia/generer-un-premier-message-via-le-profil',
        'ia/personnaliser-ton-assistant',
      ],
    },
    {
      type: 'category',
      label: 'Listes & Leads',
      collapsible: true,
      collapsed: true,
      items: [
        'listes/creer-une-liste',
        'listes/importer-des-leads',
        'listes/gerer-vos-leads',
        'listes/filtres-avances',
      ],
    },
    {
      type: 'category',
      label: 'Messages',
      collapsible: true,
      collapsed: true,
      items: [
        'messages/inbox-unifie',
        'messages/templates-reponse',
        'messages/reponses-ia',
      ],
    },
    {
      type: 'category',
      label: 'Paramètres',
      collapsible: true,
      collapsed: true,
      items: [
        'parametres/connecter-linkedin',
        'parametres/limites-securite',
        'parametres/integrations',
        'parametres/abonnement',
      ],
    },
    {
      type: 'category',
      label: 'FAQ & Dépannage',
      collapsible: true,
      collapsed: true,
      items: [
        'faq/questions-frequentes',
        'faq/resoudre-problemes',
        'faq/contact-support',
      ],
    },
  ],
};

export default sidebars;
