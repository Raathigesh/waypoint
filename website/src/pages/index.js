import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: <>Find things faster</>,
    imageUrl: "img/features/search.gif",
    description: (
      <>
        Fast project wide symbol search will let you find the code you are
        looking for faster.
      </>
    )
  },
  {
    title: <>Read without losing context</>,
    imageUrl: "img/features/symbols.gif",
    description: (
      <>
        Bring code from multiple files into a single view with inter connected
        bubbles.
      </>
    )
  },
  {
    title: <>A drafting table for your codebase</>,
    imageUrl: "img/features/drafting-table.PNG",
    description: (
      <>
        Bring all the things you need to build that exciting feature or fix that
        annoying bug into a single view.
      </>
    )
  }
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames("row feature", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <div className={styles.featureContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={` ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={classnames("hero", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/Installation")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="column">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
