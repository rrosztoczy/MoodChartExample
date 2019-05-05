document.addEventListener("DOMContentLoaded", () => {
    // TODO: Update display comments to include stress level, activity, notable event

    
    const chartContainer = document.getElementById('chart-container');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    
    const draw = async () => {
        // Can I so something in here like... get data.... format data.... map data... ?
        const parsedData = await d3.csv("MoodData.csv")
        const dateTime = await parsedData.map((moment) => moment.Time)
        const formattedDateTime = await dateTime.map(time => new Date(time))
        const stressLevel = await parsedData.map((moment) => parseInt(moment.StressLevel))
        const mood = await parsedData.map((moment) => parseInt(moment.Mood))
        const activity = await parsedData.map((moment) => moment.Activity)
        const notableEvents = await parsedData.map((moment) => moment.NotableEvent)

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
            // Note... it seems the default starting pixel for the y axis is 60, unless the window width goes below 743 so would need media queries
        const stressGradientStroke = await ctx.createLinearGradient(60, 0, window.innerWidth+60, 0);
        const stressFillGradientStroke = await ctx.createLinearGradient(60, 0, window.innerWidth+60, 0);
        stressLevel.forEach((stressData, i) => {
            stressGradientStroke.addColorStop((i/stressLevel.length).toFixed(2), gradientMap[stressData])
        })
        stressLevel.forEach((stressData, i) => {
            stressFillGradientStroke.addColorStop((i/stressLevel.length).toFixed(2), gradientFillMap[stressData])
        })
    
        const moodData = {
            labels: formattedDateTime,
            datasets: [
                {
                    label: "Mood",
                    borderColor: "#80b6f4",
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
        // responsive: true,
        tooltips: {
            callbacks: {/*place the activity and notable event here*/ 
                label: function(tooltipItem) {
                    console.log("index:", tooltipItem.index, "event", notableEvents[tooltipItem.index])
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
                labelString: "Stress Level",
                fontColor: "green"
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
    // document.addEventListener("resize", draw)
})
    