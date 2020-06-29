import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.heroCopy}>
          <img height="150px" src={useBaseUrl("img/WaypointLogo.png")} />
          <div className={styles.name}>Waypoint</div>
          <div className={styles.heroCopySubText}>
            A VSCode extension to help navigate your JS codebase
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.action}>Get the extension</button>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureText}>
            <div className={styles.featureHeader}>
              Blazing fast symbol search
            </div>
            <div className={styles.featureSubText}>
              The search indexes your source files and allows to search symbols
              blazing fast. You can also apply filters such as functions,
              classes or types to filter out unwanted items.
            </div>
          </div>
          <video
            className={styles.video}
            alt="Search"
            loop={true}
            autoPlay={true}
            muted={true}
            src={useBaseUrl("videos/search.mp4")}
          />
        </div>
        <div className={styles.feature}>
          <div className={styles.featureText}>
            <div className={styles.featureHeader}>
              Bookmark symbols and get back to them
            </div>
            <div className={styles.featureSubText}>
              You add add symbols to the bookmark panel from search results or
              by right clicking on the file itself.
            </div>
          </div>
          <video
            className={styles.video}
            alt="Search"
            height="400px"
            loop={true}
            autoPlay={true}
            muted={true}
            src={useBaseUrl("videos/bookmark.mp4")}
          />
        </div>
      </div>
      <div className={styles.bottom}>
        Built for making programming a little bit more enjoyable
      </div>
    </div>
  );
}

export default Home;
