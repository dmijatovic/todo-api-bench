import {useState, useEffect} from 'react'

export function useReport(){
  const [results, setResults] = useState()
  useEffect(()=>{
    fetch("/api/report/db.json")
      .then(r => r.json())
      .then(data=>{
        const {report} = data
        console.log("setReport...", report)
        setResults(report)
      })
  },[])
  return [results,setResults]
}
