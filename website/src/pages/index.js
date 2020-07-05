import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.heroCopy}>
          <img
            className={styles.logo}
            src={useBaseUrl("img/WaypointLogo.png")}
          />
          <div className={styles.name}>Waypoint</div>
          <div className={styles.heroCopySubText}>
            A VSCode extension to help navigate your JS codebase
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.action}
            onClick={() =>
              window.open(
                "https://marketplace.visualstudio.com/items?itemName=Raathigeshan.waypoint",
                "_blank"
              )
            }
          >
            Get the extension
          </button>
          <div className={styles.gap} />
          <Link className={styles.action} to="/docs">
            View Docs
          </Link>
          <div className={styles.gap} />
          <button
            className={styles.action}
            onClick={() =>
              window.open("https://github.com/Raathigesh/waypoint", "_blank")
            }
          >
            Github
          </button>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.wrapper}>
          <div className={styles.feature} style={{ marginTop: "30px" }}>
            <div className={styles.featureText}>
              <div className={styles.featureHeader}>
                Blazing fast symbol search
              </div>
              <div className={styles.featureSubText}>
                Find symbols fast. Apply filters such as
                <span className={styles.highlight}>functions</span>,{" "}
                <span className={styles.highlight}>classes</span> or{" "}
                <span className={styles.highlight}>types</span> to narrow your
                search.
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
              <div className={styles.featureHeader}>Bookmark symbols</div>
              <div className={styles.featureSubText}>
                You can add symbols to the bookmark panel from the search
                results or by{" "}
                <span className={styles.highlight}>
                  {" "}
                  right clicking on the file{" "}
                </span>{" "}
                itself.
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
      </div>
      <div className={styles.bottom}>
        Built for making programming a little bit more enjoyable
      </div>
    </div>
  );
}

export default Home;
