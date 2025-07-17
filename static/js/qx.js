let myChart;  

async function fetchData() {  
    try {  
        const response = await fetch('https://apphq.longhuvip.com/w1/api/index.php?PhoneOSNew=2&Token=0&UserID=0&VerSion=5.12.0.1&a=MarketCapacity&apiv=w31&Type=0&c=HomeDingPan&_=1728952039784');  
        
        if (!response.ok) {  
            throw new Error('Network response was not ok');  
        }  

        const data = await response.json();  
        return data.info.trends;  
    } catch (error) {  
        console.error('Failed to fetch data:', error);  
    }  
}  

function parseData(trends) {  
    const line1 = trends.map(item => (parseFloat(item[1]) / 10000).toFixed(1));  
    const line2 = trends.map(item => (parseFloat(item[2]) / 10000).toFixed(1));  
    const line3 = line1.map((value, index) => (value - line2[index]).toFixed(1));  
    const percentageChanges = line3.map((value, index) => {  
        const yesterdayValue = parseFloat(line2[index]);  
        return yesterdayValue !== 0 ? ((value / yesterdayValue) * 100).toFixed(1) + '%' : 'N/A';  
    });  

    return {  
        labels: trends.map(item => item[0]),  // Time labels  
        line1: line1,  // First line values  
        line2: line2,  // Second line values  
        line3: line3,  // Difference between line1 and line2  
        percentageChanges: percentageChanges  // Percentage changes for line3  
    };  
}  

function getColor(value) {  
    return value >= 0 ? '#ff0000' : '#4caf50'; // Bright red for positive, green for negative  
}  

async function updateChart() {  
    const rawData = await fetchData();  
    const parsedData = parseData(rawData);  

    if (myChart) {  
        myChart.data.labels = parsedData.labels;  
        myChart.data.datasets[0].data = parsedData.line1;  
        myChart.data.datasets[1].data = parsedData.line2;  
        myChart.data.datasets[2].data = parsedData.line3;  

        const lastValue = parsedData.line3[parsedData.line3.length - 1];  
        const lastPercentageChange = parsedData.percentageChanges[parsedData.percentageChanges.length - 1];  
        myChart.data.datasets[0].label = `今日成交额 (${parsedData.line1[parsedData.line1.length - 1]} 亿)`;  
        myChart.data.datasets[1].label = `昨日成交额 (${parsedData.line2[parsedData.line2.length - 1]} 亿)`;  
        myChart.data.datasets[2].label = `实时差额 (${lastValue} 亿, ${lastPercentageChange})`;  

        myChart.data.datasets[2].borderColor = getColor(lastValue);  

        myChart.update();  
    }  
}  

function shouldUpdateData() {  
    const now = new Date();  
    const day = now.getDay();  
    const hours = now.getHours();  
    const minutes = now.getMinutes();  

    return day >= 1 && day <= 5 && (hours > 9 || (hours === 9 && minutes >= 15)) && (hours < 15 || (hours === 15 && minutes === 0));  
}  

async function drawChart() {  
    const rawData = await fetchData();  
    const parsedData = parseData(rawData);  

    const data = {  
        labels: parsedData.labels,  
        datasets: [  
            {  
                label: `今日成交额 (${parsedData.line1[parsedData.line1.length - 1]} 亿)`,  
                data: parsedData.line1,  
                fill: false,  
                borderColor: '#ffffff',  
                borderWidth: 1,  
                tension: 0.1,  
                pointRadius: 0  
            },  
            {  
                label: `昨日成交额 (${parsedData.line2[parsedData.line2.length - 1]} 亿)`,  
                data: parsedData.line2,  
                fill: false,  
                borderColor: '#ffd700',  
                borderWidth: 1,  
                tension: 0.1,  
                pointRadius: 0  
            },  
            {  
                label: `实时差额 (${parsedData.line3[parsedData.line3.length - 1]} 亿, ${parsedData.percentageChanges[parsedData.percentageChanges.length - 1]})`,  
                data: parsedData.line3,  
                fill: false,  
                borderColor: getColor(parsedData.line3[parsedData.line3.length - 1]),  
                borderWidth: 1,  
                tension: 0.1,  
                pointRadius: 0  
            }  
        ]  
    };  

    const ctx = document.getElementById('myChart').getContext('2d');  

    myChart = new Chart(ctx, {  
        type: 'line',  
        data: data,  
        options: {  
            responsive: true,  
            maintainAspectRatio: false,  
            plugins: {  
                legend: {  
                    position: 'top',  
                    align: 'start',  
                    labels: {  
                        font: {  
                            size: 14  
                        },  
                        boxWidth: 10,  
                        boxHeight: 10,  
                        generateLabels: function(chart) {  
                            const datasets = chart.data.datasets;  
                            return datasets.map((dataset, i) => {  
                                const lastValue = dataset.data[dataset.data.length - 1];  
                                const labelText = dataset.label;  
                                const color = i === 2 ? getColor(lastValue) : '#ffffff';  

                                if (i === 2) {  
                                    const parts = labelText.split(' ');  
                                    const baseText = parts[0];  
                                    const valueText = parts.slice(1).join(' ');  
                                    return {  
                                        text: baseText + ' ' + valueText,  
                                        fillStyle: dataset.borderColor,  
                                        strokeStyle: dataset.borderColor,  
                                        lineWidth: 1,  
                                        hidden: !chart.isDatasetVisible(i),  
                                        index: i,  
                                        fontColor: color  
                                    };  
                                }  

                                return {  
                                    text: labelText,  
                                    fillStyle: dataset.borderColor,  
                                    strokeStyle: dataset.borderColor,  
                                    lineWidth: 1,  
                                    hidden: !chart.isDatasetVisible(i),  
                                    index: i,  
                                    fontColor: '#ffffff'  
                                };  
                            });  
                        }  
                    }  
                },  
                tooltip: {  
                    mode: 'index',  
                    intersect: false,  
                    callbacks: {  
                        label: function(context) {  
                            return context.dataset.label + ': ' + context.raw + ' 亿';  
                        }  
                    }  
                },  
                crosshair: {  
                    line: {  
                        color: '#ffffff',  
                        width: 1  
                    },  
                    sync: {  
                        enabled: false  
                    },  
                    zoom: {  
                        enabled: false  
                    }  
                }  
            },  
            interaction: {  
                mode: 'index',  
                intersect: false  
            },  
            scales: {  
                y: {  
                    beginAtZero: true,  
                    title: {  
                        display: true,  
                        text: 'Values (亿)',  
                        color: '#ffffff'  
                    },  
                    ticks: {  
                        color: '#ffffff',  
                        font: {  
                            size: 14  
                        }  
                    },  
                    grid: {  
                        color: '#121212'  
                    }  
                },  
                x: {  
                    title: {  
                        display: true,  
                        text: 'Time (Minutes)',  
                        color: '#ffffff'  
                    },  
                    ticks: {  
                        color: '#ffffff',  
                        font: {  
                            size: 14  
                        }  
                    },  
                    grid: {  
                        color: '#121212'  
                    }  
                }  
            }  
        }  
    });  
}  

window.onload = function() {  
    drawChart();  
    setInterval(() => {  
        if (shouldUpdateData()) {  
            updateChart();  
        }  
    }, 5000);  
}; 