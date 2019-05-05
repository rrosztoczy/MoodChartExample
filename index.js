document.addEventListener("DOMContentLoaded", () => {

    //Container for gradient object sizing
    const chartContainer = document.getElementById('chart-container')
    , canvas = document.getElementById('canvas')
    , ctx = canvas.getContext('2d');

    const gradientMap = {
        10: 'rgba(255, 0, 0, 1)',
        9: 'rgba(255, 51, 0, 1)',
        8: 'rgba(255, 102, 0, 1)',
        7: 'rgba(255, 153, 0, 1)',
        6: 'rgba(255, 204, 0, 1)',
        5: 'rgba(255, 255, 0, 1)',
        4: 'rgba(204, 255, 0, 1)',
        3: 'rgba(153, 255, 0, 1)', 
        2: 'rgba(102, 255, 0, 1)',
        1: 'rgba(51, 255, 0, 1)'
    }

    const gradientFillMap = {
        10: 'rgba(255, 0, 0, 0.3)',
        9: 'rgba(255, 51, 0, 0.3)',
        8: 'rgba(255, 102, 0, 0.3)',
        7: 'rgba(255, 153, 0, 0.3)',
        6: 'rgba(255, 204, 0, 0.3)',
        5: 'rgba(255, 255, 0, 0.3)',
        4: 'rgba(204, 255, 0, 0.3)',
        3: 'rgba(153, 255, 0, 0.3)', 
        2: 'rgba(102, 255, 0, 0.3)',
        1: 'rgba(51, 255, 0, 0.3)'
    }

    
    const draw = async () => {
        // Parse data from csv, generate and format data series for chart
        const parsedData = await d3.csv("MoodData.csv")
        , dateTime = await parsedData.map((moment) => moment.Time)
        , formattedDateTime = await dateTime.map(time => new Date(time))
        , stressLevel = await parsedData.map((moment) => parseInt(moment.StressLevel))
        , mood = await parsedData.map((moment) => parseInt(moment.Mood))
        , activity = await parsedData.map((moment) => moment.Activity)
        , notableEvents = await parsedData.map((moment) => moment.NotableEvent)

        // Note... it seems the default starting pixel for the y axis is 60, unless vw < 743 need media queries
        // Must be in draw to keep gradient relative to window
        const stressGradientStroke = await ctx.createLinearGradient(60, 0, window.innerWidth+60, 0)
        , stressFillGradientStroke = await ctx.createLinearGradient(60, 0, window.innerWidth+60, 0);

        stressLevel.forEach((stressData, i) => {
            stressGradientStroke.addColorStop((i/stressLevel.length).toFixed(2), gradientMap[stressData])
            stressFillGradientStroke.addColorStop((i/stressLevel.length).toFixed(2), gradientFillMap[stressData])
        })
        
        // Main dataset and data config for chart
        const moodData = {
            labels: formattedDateTime,
            datasets: [
                {
                    label: "Mood",
                    borderColor: "#80b6f4",
                    backgroundColor: "#80b6f4",
                    pointBorderColor: "#80b6f4",
                    pointBackgroundColor: "#80b6f4",
                    pointHoverBackgroundColor: "#80b6f4",
                    pointHoverBorderColor: "#80b6f4",
                    fill: false,
                    data: mood
                },
                {
                    label: "Stress Level",
                    fill: true,
                    backgroundColor: stressFillGradientStroke,
                    borderColor: stressGradientStroke,
                    pointBorderColor: stressGradientStroke,
                    pointBackgroundColor: stressGradientStroke,
                    pointHoverBackgroundColor: stressGradientStroke,
                    pointHoverBorderColor: stressGradientStroke,
                    data: stressLevel
                }
            ]
        }
    
        const options = {
        tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    let event = notableEvents[tooltipItem.index] ? "\n!Note: " + notableEvents[tooltipItem.index] : ""
                    return "While " + activity[tooltipItem.index] + " " + event;
                }
            },
            hover: {
            mode: 'nearest',
            intersect: true
            }},
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
        },
        scales: {
            xAxes: [{
                type: "time",
                time: {
                    unit: 'hour',
                    unitStepSize: 0.5,
                    round: 'hour',
                    tooltipFormat: "h:mm:ss a",
                    displayFormats: {
                    hour: 'MMM D, h:mm A'
                    }
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "black",
                    borderDash: [2, 5],
                },
                scaleLabel: {
                    display: true,
                    labelString: "Stress Level"
                }
            }]
        },
        animation: {
            easing: "easeInOutBack"
          }
        }
    
    const myChart = await new Chart(ctx, {
        type: 'line',
        data: moodData,
        options: options
    })
        
    
    }
    draw()
    //Keep gradient size relative to window size
    window.addEventListener("resize", draw)
})
    