
import { getDataList } from "../apiDataList"

import BarCharts from "./BarCharts"

export default async function ChartPage(){
  const dbList = await getDataList()

  return(
    <section>
      <BarCharts dbList={dbList} />
    </section>
  )
}