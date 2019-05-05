document.addEventListener("DOMContentLoaded", () => {
    // TODO: Goal is to map gradient colors at each point to mood/stress values and levels
    // Only ten levels... so mapping not too tough.... 
    // So stressGS createLinearGradient(x0, y0, x1, y1) = createLinearGradient(formattedDateTime[0], stressLevel[0], formattedDateTime[1], stressLevel[1])

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    
    (async () => {
        // Can I so something in here like... get data.... format data.... map data... ?
        const parsedData = await d3.csv("MoodData.csv")
        const dateTime = await parsedData.map((moment) => moment.Time)
        const formattedDateTime = await dateTime.map(time => new Date(time))
        const stressLevel = await parsedData.map((moment) => parseInt(moment.StressLevel))
        const mood = await parsedData.map((moment) => parseInt(moment.Mood))
        const activity = await parsedData.map((moment) => moment.Activity)
        console.log("set variables", activity)
        console.log("set variables", formattedDateTime)
        console.log("set variables", mood)
        console.log("set variables", stressLevel)

        const stressGradientStroke = await ctx.createLinearGradient(60, 0, 1020, 0);
        console.log("canvas coord", canvas.clientWidth, canvas.clientHeight)
        // For each element in stressLevel, create a stressGradientStroke.addColorStop(point, color)
        // Point should be... what?
        // Color should be dynamic based on teh stress value
        // So point should be that index / array.length
        // Color will be a map.... get green yellow orange red gradient with ten steps
        const gradientMap = {
        10: '#FF0000',
        9: '#FF3300',
        8: '#ff6600',
        7: '#ff9900',
        6: '#FFCC00',
        5: '#FFFF00',
        4: '#ccff00',
        3: '#99ff00', /*problem child... why is three defining everything? That is the very first stress level data point */
        2: '#66ff00',
        1: '#33ff00'
        }
        stressLevel.forEach((stressData, i) => {
            console.log("position:", (i/stressLevel.length).toFixed(2), "hex", gradientMap[stressData], "stress data", stressData)
            stressGradientStroke.addColorStop((i/stressLevel.length).toFixed(2), gradientMap[stressData])
        })

        console.log(stressGradientStroke)
    
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
                    backgroundColor: stressGradientStroke,
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
    
    var myChart = await new Chart(ctx, {
        type: 'line',
        data: moodData,
        options: options
    })
        
    
    })()
    })
    