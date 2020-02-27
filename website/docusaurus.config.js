module.exports = {
  title: "JS Bubbles",
  tagline: "Re-imagining reading and navigating JavaScript codebases in VSCode",
  url: "https://jsbubbles.netlify.com",
  baseUrl: "/",
  favicon: "img/icon.png",
  organizationName: "JSBubbles", // Usually your GitHub org/user name.
  projectName: "JSBubbles", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "JS Bubbles",
      logo: {
        alt: "JS Bubbles",
        src: "img/icon.png"
      },
      links: [
        { to: "docs/Installation", label: "Docs", position: "left" },
        {
          href: "https://github.com/Raathigesh/JSBubbles",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} JS Bubbles`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/facebook/docusaurus/edit/master/website/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ]
};
