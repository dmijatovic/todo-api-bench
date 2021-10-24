import {useReport} from "../utils/useReport"
import ReportTable from "../components/ReportTable"
import EmptyPlaceholder from "../components/EmptyPlaceholder"


export default()=>{
  const [report, _] = useReport()
  const header=['title','2xx', 'non2xx','duration','connections','system','coreCnt','speedBefore','speedAfter','finish']

  const tableSection = () =>{
    if (!report){
      return (
        <section>
          <dv4-loader-timer>Loading message...</dv4-loader-timer>
        </section>
      )
    }else if (report.length===0){
      return <EmptyPlaceholder />
    }else{
      return (
        <section>
          <ReportTable
            header = {header}
            data = {report}
          />
        </section>
      )
    }
  }

  return (
    <article>
      <h1>Todo api load tests table</h1>
      {tableSection()}
    </article>
  )
}