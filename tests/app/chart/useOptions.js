import {useState, useEffect} from 'react'
import {getOptions} from "../../utils/getOptions"

export default function useOptions(file){
  const [options, setOptions] = useState()
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    if (file){
      setLoading(true)
      fetch(`/api/report/${file}`)
        .then(r => r.json())
        .then(data=>{
          const {report} = data
          // console.log("setReport...", report)
          const options = getOptions(report,60)
          setOptions(options)
          setLoading(false)
        })
    }
  },[file])
  return {
    loading,
    options
  }
}
