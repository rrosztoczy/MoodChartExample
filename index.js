document.addEventListener("DOMContentLoaded", () => {
    // TODO: Map gradient colors at each point to mood/stress values and levels

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const stressGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    stressGradientStroke.addColorStop(0, "#94d973");
    stressGradientStroke.addColorStop(0.5, "#fad874");
    stressGradientStroke.addColorStop(1, "#f49080");

    const moodGradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    moodGradientStroke.addColorStop(0, "#94d973");
    moodGradientStroke.addColorStop(0.5, "#fad874");
    moodGradientStroke.addColorStop(1, "#f49080");

    const stressGradientFill = ctx.createLinearGradient(500, 0, 100, 0);
    stressGradientFill.addColorStop(0, "rgba(128, 182, 244, 0.6)");
    stressGradientFill.addColorStop(1, "rgba(244, 144, 128, 0.6)");
    
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
    
        const moodData = {
            labels: formattedDateTime,
            datasets: [
                {
                    label: "Mood",
                    borderColor: moodGradientStroke,
                    pointBorderColor: moodGradientStroke,
                    pointBackgroundColor: moodGradientStroke,
                    pointHoverBackgroundColor: moodGradientStroke,
                    pointHoverBorderColor: moodGradientStroke,
                    fill: false,
                    data: mood
                },
                {
                    label: "Stress Level",
                    fill: true,
                    backgroundColor: stressGradientFill,
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
    