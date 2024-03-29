
function buildTable(info){
  // const cols=[{title:"Cnn", key:""}]
  let tbl =`
    <table class="hc-tooltip-tbl">
      <tr><td class="tooltip-lbl">Api variant</td><td><b>${info['title']}</b></td></tr>
      <tr><td class="tooltip-lbl">2xx OK</td><td>${info['2xx']}</td></tr>
      <tr><td class="tooltip-lbl">Non2xx</td><td>${info['non2xx']}</td></tr>
      <tr><td class="tooltip-lbl">Created items</td><td>${info.Created ? (info.Created.list + info.Created.item):"n/a"}</td></tr>
      <tr><td class="tooltip-lbl">Id not returned</td><td>${info.IdNotRetuned ? (info.IdNotRetuned.list + info.IdNotRetuned.item):"n/a"}</td></tr>
      <tr><td class="tooltip-lbl">Latency (mean)</td><td>${info['latency']['mean']} ms</td></tr>
      <tr><td class="tooltip-lbl">Duration</td><td>${info.duration}</td></tr>
      <tr><td class="tooltip-lbl">Connections</td><td>${info.connections}</td></tr>
      <tr><td class="tooltip-lbl">System</td><td>${info?.system}</td></tr>
      <tr><td class="tooltip-lbl">Cores</td><td>${info?.coreCnt}</td></tr>
      <tr><td class="tooltip-lbl">Before test</td><td>${info?.speedBefore}</td></tr>
      <tr><td class="tooltip-lbl">After test</td><td>${info?.speedAfter}</td></tr>
      <tr><td class="tooltip-lbl">Start time</td><td>${info?.start}</td></tr>
      <tr><td class="tooltip-lbl">End time</td><td>${info?.finish}</td></tr>
    </table>
  `
  // <tr><td class="tooltip-lbl">Timeouts</td><td>${info.timeouts}</td></tr>
  // <tr><td class="tooltip-lbl">Errors</td><td>${info.errors}</td></tr>
  return tbl
}

const options = {
  title:{
    text:"Todo api load test (60sec)",
  },
  chart:{
    height:600
  },
  accessibility:{
    enabled:false
  },
  credits:{
    enabled:false
  },
  xAxis:{
    title:{
      text:'Runs'
    },
    allowDecimals: false
    // categories:['Cat1', 'Cat2', 'Cat3','Cat4']
  },
  yAxis:{
    title:{
      text:"Requests returned with 2xx (OK)"
    },
    // set minimum to 0
    min:0
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
      // console.log("data.point.info", info)
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
export function getOptions(report=[], testTime=30){
  const categories={}, cat=[], series=[]
  // console.log("getOptions.testTime...", testTime)
  // convert data to tools
  report.filter(({duration})=>{
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
    // debugger
    // series
    series.push({
      type:"line",
      name:key,
      // dataSorting:{
      //   enabled:true,
      //   matchByName: true,
      //   // sortKey: 'value'
      // },
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