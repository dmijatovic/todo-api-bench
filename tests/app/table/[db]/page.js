import ReportTable from "../../../components/ReportTable"
import EmptyPlaceholder from "../../../components/EmptyPlaceholder"
import { getTableData } from "../apiTable"


export default async function TablePage({params}){
  const report =  await getTableData(params['db'])
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