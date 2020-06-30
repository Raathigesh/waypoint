module.exports = {
  title: "Waypoint",
  tagline: "A VSCode extension to help navigate your JS codebase",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  favicon: "img/favicon.png",
  organizationName: "raathigesh", // Usually your GitHub org/user name.
  projectName: "waypoint", // Usually your repo name.
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: "Waypoint",
      logo: {
        alt: "Waypoint Logo",
        src: "img/WaypointLogo.png"
      },
      links: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left"
        },
        {
          href: "https://github.com/Raathigesh/waypoint",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()}`
    },
    disableDarkMode: true
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: "doc1",
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/Raathigesh/waypoint/edit/master/website/"
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/Raathigesh/waypoint/edit/master/website/blog/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Manjari:wght@100;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Sofia&display=swap",
    "https://fonts.googleapis.com/css2?family=Sen:wght@400;700&display=swap"
  ]
};
