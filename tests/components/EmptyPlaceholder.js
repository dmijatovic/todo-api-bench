
import styles from "./EmptyPlaceholder.module.css"

export default ()=>{
  return (
    <section className={styles.section}>
      <dv4-icon-notification class={styles.icon} title="Info icon"></dv4-icon-notification>
      <h3 className={styles.header}>Nothing to report</h3>
      <p>It seems there are no load test to report. Look at the README file for inststuctions how to run load tests using autocannon and any of Todo api's available in this project.</p>
    </section>
  )

}