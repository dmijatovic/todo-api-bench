import ReportChart from "../components/ReportChart"
import {useReport} from "../utils/useReport"
import {getOptions} from "../utils/getOptions"
import EmptyPlaceholder from "../components/EmptyPlaceholder"

export default(props)=>{
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
      <h1>Benchmark chart</h1>
      {loadChart()}
    </article>
  )
}