let arrayContent
let line_chart
let isSet = false

function csvToArray(csv) {
    const lines = csv.split('\n');
    return lines.map(line => line.split(',').map(cell => cell.trim()));
}

function readcsv(filename, callback) {
    if (filename && filename.type === "text/csv") {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csv = e.target.result;
            arrayContent = csvToArray(csv)

            if (callback) {
                callback(arrayContent);
            }
        };

        reader.onerror = function () {
            console.log('Error reading file');
        };

        reader.readAsText(filename);
    } else {
        console.log('Please upload a valid csv file');
    }
}

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];

    readcsv(file, () => updateChart("line"))
});

function updateChart() {
    console.log(JSON.stringify(arrayContent, null, 2))

    let line_title = document.getElementById("line_title").value
    let line_x = document.getElementById("line_x").value
    let line_y = document.getElementById("line_y").value

    let type = document.querySelector('input[name="type"]:checked').value;

    if (line_title.length == 0) {
        line_title = " "
    }

    if (line_y.length == 0) {
        line_y = arrayContent[0][1]
    }

    let x_readings = []
    for (let index = 1; index < arrayContent.length; index++) {
        const value = arrayContent[index][0]
        if (!isNaN(value)) {
            x_readings.push(parseFloat(value))
        }
    }

    let line_series = []
    for (let i = 1; i < arrayContent[0].length; i++) {
        let series_name = arrayContent[0][i]

        let series_data = []
        for (let index = 1; index < arrayContent.length; index++) {
            const value = arrayContent[index][i]
            if (!isNaN(value)) {
                series_data.push(parseFloat(value))
            }

        }
        line_series.push({
            name: series_name,
            data: series_data
        })
    }


    data = {
        chart: {
            type: type,
            height: 650
        },
        title: {
            text: line_title,
            floating: false,
            align: "center",
            style: {
                color: "#444"
            }
        },
        series: line_series,
        xaxis: {
            categories: x_readings,
            title: {
                text: line_x
            }
        },
        yaxis: {
            title: {
                text: line_y
            }
        }
    }

    console.log(JSON.stringify(data, null, 2))
    if (!isSet) {
        line_chart = new ApexCharts(document.getElementById("chart1"), data);

        line_chart.render();

        isSet = true

        //enable buttons
        document.getElementById("line_download").disabled = false
        document.getElementById("line_update").disabled = false
    }
    else {
        line_chart.updateOptions({
            chart: {
                type: type,
            },
            series: line_series
        })
    }
}

document.getElementById('line_download').addEventListener('click', function (event) {
    line_chart.exports.exportToPng();
});

document.getElementById('line_update').addEventListener('click', function (event) {

    let line_title = document.getElementById("line_title").value
    let line_x = document.getElementById("line_x").value
    let line_y = document.getElementById("line_y").value
    let type = document.querySelector('input[name="type"]:checked').value;

    if (line_title.length == 0) {
        line_title = " "
    }
    if (line_x.length == 0) {
        line_x = " "
    }
    if (line_y.length == 0) {
        line_y = " "
    }

    console.log(line_title)
    line_chart.updateOptions({
        chart: {
            type: type,
        },
        title: {
            text: line_title
        },
        xaxis: {
            title: {
                text: line_x
            }
        },
        yaxis: {
            title: {
                text: line_y
            }
        }
    })
});