
function buildTable(info){
  // const cols=[{title:"Cnn", key:""}]
  let tbl =`
    <table class="hc-tooltip-tbl">
      <tr><td class="tooltip-lbl">Api variant</td><td><b>${info['title']}</b></td></tr>
      <tr><td class="tooltip-lbl">2xx OK</td><td>${info['2xx']}</td></tr>
      <tr><td class="tooltip-lbl">Non2xx</td><td>${info['non2xx']}</td></tr>
      <tr><td class="tooltip-lbl">Latency (mean)</td><td>${info['latency']['mean']}</td></tr>
      <tr><td class="tooltip-lbl">Connections</td><td>${info.connections}</td></tr>
      <tr><td class="tooltip-lbl">Duration</td><td>${info.duration}</td></tr>
      <tr><td class="tooltip-lbl">Timeouts</td><td>${info.timeouts}</td></tr>
    </table>
  `
  return tbl
}


const options = {
  title:{
    text:"Todo api load test (60sec)",
  },
  chart:{
    height:600
  },
  credits:{
    enabled:false
  },
  xAxis:{
    title:{
      text:'Runs'
    }
    // categories:['Cat1', 'Cat2', 'Cat3','Cat4']
  },
  yAxis:{
    title:{
      text:"Requests returned with 2xx (OK)"
    }
  },
  plotOptions: {
    series: {
        label: {
            connectorAllowed: false
        },
        pointStart: 1
    }
  },
  tooltip:{
    useHTML:true,
    formatter:function(){
      const i = this.point.index
      const info = this.series.options.report[i]
      console.log("data.point.info", info)
      // return `<pre>${JSON.stringify(info)}</pre>`
      return buildTable(info)
    }
  },
  series:[{
    type:'bar',
    name:'group1',
    data:[1,2,3]
  },{
    type:'bar',
    name:'group2',
    data:[4,6,7,5]
  }]
}

/**
 * Get Highcharts options object
 * @param {Array} report array of objects as loaded from api and producted by autocannon
 * @param {Number} testTime test time specified in autocannon in seconds
 */
export function getOptions(report=[], testTime=3){
  const categories={}, cat=[], series=[]

  // convert data to tools
  report.filter(({duration})=>{
      // debugger
      return (parseInt(duration) === testTime)
    }).forEach(item=>{
    //extract title for key
    const {title,duration} = item
    //check key
    if (!categories[title]){
      categories[title]={
        data:[],
        src: []
      }
    }
    //write values
    categories[title].data.push(item["2xx"])
    categories[title].src.push(item)
  })

  const keys = Object.keys(categories)

  keys.forEach(key=>{
    //categories
    const item = categories[key]
    // cat.push(key)
    //series
    series.push({
      type:"line",
      name:key,
      data: item.data,
      report: item.src
    })

  })
  // debugger
  options.title.text=`Todo api load test for ${testTime}sec.`
  options.series = series
  // console.log("report", report)
  return options
}