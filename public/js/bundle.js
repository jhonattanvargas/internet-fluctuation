var speed    
var chart
var data
var sponsors = new Array()

onload = () =>{
    fetch('http://localhost:3000/data')
        .then(res => {
            if(res.status === 200){
                res.json().then(d => {
                    speed = d
                    data = speed
                    console.log('data loaded')
                    loadChart()
                    getSponsors()
                })
            }
        })
}

function getSponsors(){
    data.map( x => {
        if(!sponsors.includes(x.server.sponsor))
            sponsors.push(x.server.sponsor)
    })
    let select = document.getElementById('sponsor')
    sponsors.map(x => {
        //select
        let option = document.createElement('option')
        option.value = x
        option.label = x
        select.appendChild(option)

        //table
        let len = data.filter( y => y.server.sponsor === x).length
        let tableRef = document.getElementById('table-sponsors').getElementsByTagName('tbody')[0]
        let newRow   = tableRef.insertRow(tableRef.rows.length)
        let newCellSponsor  = newRow.insertCell(0)
        let newTextSponsor  = document.createTextNode(x)
        newCellSponsor.appendChild(newTextSponsor)
        let newCellRequest  = newRow.insertCell(1)
        let newTextRequest  = document.createTextNode(len)
        newCellRequest.appendChild(newTextRequest)        
    })
}

function filterSponsor(val){
    if(val === 'All'){
        speed = data
    }else{
        speed = data.filter( x => x.server.sponsor === val)
    }
    loadChart()
}


function toggle(type){
    
    if(type === 'download'){
        series = chart.series[0]            
    }
    if(type === 'upload'){
        series = chart.series[1]
    }

    if(series.visible)
        series.hide()
    else
        series.show()
}

function loadChart() {

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    // Create the chart
    chart = Highcharts.stockChart('container', {
        chart: {
            events: {
                load: function () {
                    // set up the updating of the chart each second
                    var series = this.series[0]
                }
            }
        },

        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }, {
                count: 5,
                type: 'minute',
                text: '5M'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: true,
            selected: 2
        },

        title: {
            text: 'Internet Fluctuation Speed'
        },

        exporting: {
            enabled: false
        },

        series: [{
            name: 'Download',
            data: (function () {
                var data = new Array()
                speed.map( (x, i) => {
                    let time = new Date(x.time).getTime()
                    //if(i< 40)
                        data.push([time, x.speeds.download])
                })
                data.sort(function(a, b){return a[0]-b[0]})
                //console.log(data)

                return data;
            }())
        },
        {
            name: 'Upload',
            data: (function () {
                var data = new Array()
                speed.map( (x, i) => {
                    let time = new Date(x.time).getTime()
                    //if(i< 40)
                        data.push([time, x.speeds.upload])
                })
                data.sort(function(a, b){return a[0]-b[0]})
                //console.log(data)

                return data;
            }()),
        }]
    });
} 
