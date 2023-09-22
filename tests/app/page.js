
import { getDataList } from "./chart/apiChart"
import BarCharts from "./chart/BarCharts"

export default async function Homepage(){
  const dbList = await getDataList()

  return (
    <article>
      <h1>Todo api load tests by framework</h1>
      <p>
        Below are the results from the load tests for each api framework I tried.
        The charts show the amount of requests handled by each api during the
        maximum server load for 60 seconds. <b>Higher score is better.</b>&nbsp;
        Load tests are performed with <a href="https://github.com/mcollina/autocannon" target="_new">autocannon</a>. The duration of load test can
        be changed in the configuration of autocannon scripts (autocannon/utils.js).
      </p>
      
      <BarCharts dbList={dbList} />
      
      <h3>How to reproduce the results?</h3>
      <p>
        You can clone this repo and run all load tests on your own. There is a shell
        script in the root of the repo that will run one round of tests for all api's once.
        Your figures will high likely be different. I excpect that running this benchmark on different machines
        and processors will provide us some interessting insights!
      </p>
    </article>    
  )
}