
import {useState, useEffect} from 'react'

function HomePage() {
  const [state, setState] = useState()

  useEffect(()=>{
    fetch("/api/report")
      .then(r => r.json())
      .then(data=>{
        const {report} = data
        setState(report)
      })
  },[])

  console.log("reports...", state)

  const header=['title','2xx', 'non2xx','duration','connections', 'finish']

  const reportHeader = () =>{
    return (
      <tr>
        {header.map(item=>{
          return (
          <th key={item}>
            {item}
          </th>)
        })}
      </tr>
    )
  }

  const reportTable =  () =>{
    if (!state) return (
    <dv4-loader-timer>
      Loading message...
    </dv4-loader-timer>
    )

    const html = state.map((item,pos) =>{
      return (
        <tr key={pos}>
          {header.map(col=>{
            return (
              <td>
                {item[col]}
              </td>
            )
          })}
        </tr>
      )
    })

    return (
      <table>
        <thead>
          {reportHeader()}
        </thead>
        <tbody>
          {html}
        </tbody>
      </table>
    )
  }


  return (
    <article>
      <h1>Todo api bench</h1>
      <p>Here we show some basic results from different api technologies used</p>
      <section>
        {reportTable()}
      </section>
    </article>
  )
}

export default HomePage