'use client'

import { useEffect, useState } from "react"
import EmptyPlaceholder from "./EmptyPlaceholder"

const styles={
  width: "100%",
}

export default function BenchmarkImage({imageList=[]}){
  const [selected, setSelected] = useState()

  useEffect(()=>{
    if (imageList?.length > 0){
      // const sel = imageList[0]
      setSelected(imageList[0])
    }
  },[imageList])

  if (typeof selected == "undefined"){
    return <EmptyPlaceholder />
  }

  return(
    <section>
        
      <select
        style={{
          padding:'0.5rem',
          marginBottom:'1rem'
        }}
        onChange={({target})=>{
          const item = imageList[parseInt(target.value)] 
          setSelected(item)
        }}
      >
        {imageList.map((item,pos)=><option key={item.file} value={pos}>{item.file}</option>)}
      </select>
      
      {selected.href ? 
        <div style={{overflow:"auto",width:"100%"}}>
          <img src={selected?.href} alt={selected.file}/>
        </div>
        : null
      }
    </section>
  )

}