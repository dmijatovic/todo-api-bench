import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default ({options, className})=>{
  // debugger
  return(
    <section className={className}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </section>
  )
}