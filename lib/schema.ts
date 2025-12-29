export function generateEducationalSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Binary Search Tree Visualization - Interactive BST Visualizer",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Interactive Binary Search Tree Visualization tool for learning data structures and algorithms. Visualize BST operations including insert, delete, search, and traversal in real-time.",
    url: "https://bst.oudommeng.me",
    featureList: [
      "Binary Search Tree Visualization",
      "Interactive BST Operations",
      "Real-time Tree Animation",
      "Insert and Delete Nodes",
      "Tree Traversal Visualization",
      "Educational Tool for Data Structures",
    ],
    about: {
      "@type": "Thing",
      name: "Binary Search Tree",
      description:
        "A data structure used in computer science for efficient searching and sorting",
    },
    author: [
      {
        "@type": "Person",
        name: "Pun Solita",
      },
      {
        "@type": "Person",
        name: "Meng Oudom",
      },
      {
        "@type": "Person",
        name: "Khoun Sovansunchhay",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Team SSO - CADT",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
  };
}

export function generateBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bst.oudommeng.me",
      },
    ],
  };
}
