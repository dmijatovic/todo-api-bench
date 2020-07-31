
import {useReport} from "../utils/useReport"
import {getOptions} from "../utils/getOptions"
import ReportChart from "../components/ReportChart"
import EmptyPlaceholder from "../components/EmptyPlaceholder"

function HomePage() {
  const [report, _] = useReport()

  const loadChart=()=>{
    if (!report){
      return (
      <section>
        <dv4-loader-timer>Loading chart...</dv4-loader-timer>
      </section>
      )
    }else if (report.length===0){
      return <EmptyPlaceholder />
    }else{
      return <ReportChart
        className="hc-chart-section"
        options={getOptions(report)} />
    }
  }

  return (
    <article>
      <h1>Todo api bench</h1>
      <p>
        Here we show basic results from different api technologies I tried.
        The simple table otput is avaliable <a href="/table">here</a>.
        All data generated by autocannon can be extracted <a href="/api/report">
        from here</a>.
      </p>
      {loadChart()}
    </article>
  )
}

export default HomePage