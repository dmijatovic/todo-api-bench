
export default ({header=[], data=null})=>{
  if (data===null) return null
  // debugger
  const tableHeader = () =>{
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

  const tableBody = () =>{
    return data.map((item,pos) =>{
      return (
        <tr key={pos}>
          {header.map(col=>{
            return (
              <td key={`${pos}-${col}`}>
                {item[col]}
              </td>
            )
          })}
        </tr>
      )
    })
  }

  return (
    <table>
      <thead>
        {tableHeader()}
      </thead>
      <tbody>
        {tableBody()}
      </tbody>
    </table>
  )
}