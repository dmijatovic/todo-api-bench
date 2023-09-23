
import {getImageList} from "./apiBench"
import BenchmarkImage from "../../components/BenchmarkImage"

// Next app metadata export
export const metadata = {
  title: 'Benchmarks',
}

export default async function BenchPage(){
  const list = await getImageList()
  return (
    <section>
      <h1>Benchmark results (images)</h1>
      {/* <pre>{JSON.stringify(list,null,2)}</pre> */}
      <BenchmarkImage imageList={list} />
    </section>
  )
}