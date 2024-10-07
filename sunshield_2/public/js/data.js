document.addEventListener('DOMContentLoaded', function() {
    try {
        const icons = ['🏊‍♂️', '🏠', '⚽', '🎡', '🏫'];
        const data = {
            labels: icons,
            datasets: [{
                data: [69, 12, 8, 7, 3],
                backgroundColor: [
                    'rgba(96, 165, 250, 0.7)',
                    'rgba(244, 114, 182, 0.7)',
                    'rgba(52, 211, 153, 0.7)',
                    'rgba(252, 211, 77, 0.7)',
                    'rgba(167, 139, 250, 0.7)'
                ],
                borderRadius: 8,
                borderColor: [
                    'rgba(96, 165, 250, 0.9)',
                    'rgba(244, 114, 182, 0.9)',
                    'rgba(52, 211, 153, 0.9)',
                    'rgba(252, 211, 77, 0.9)',
                    'rgba(167, 139, 250, 0.9)'
                ],
                borderWidth: 2
            }]
        };

        const activities = [
            'Water-based activity',
            'Private residence',
            'Structured outdoor activity',
            'Unstructured outdoor activity',
            'School or Creche or Work'
        ];

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return activities[context[0].dataIndex];
                            },
                            label: function(context) {
                                return `${context.parsed.y}% of the kids are prone to sunburn here`;
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        titleColor: '#1e40af',
                        bodyColor: '#1e40af',
                        borderColor: '#93c5fd',
                        borderWidth: 1,
                        padding: 10
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: 14
                            },
                            color: '#64748b'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 24
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        };

        const ctx = document.getElementById('sunburnChart');
        if (ctx) {
            new Chart(ctx.getContext('2d'), config);
        } else {
            console.error('Cannot find element with id "sunburnChart"');
        }


        const trendData = {
            labels: ['04/05', '05/06', '06/07', '07/08', '08/09', '09/10', '10/11', '11/12', '12/13', '13/14', '14/15', '15/16', '16/17', '17/18', '18/19', '19/20', '20/21', '21/22'],
            datasets: [{
                label: 'Number of Sunburn Presentations',
                data: [163, 229, 138, 181, 315, 261, 330, 305, 226, 267, 216, 224, 367, 289, 342, 223, 359, 344],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.1
            }]
        };

        const trendConfig = {
            type: 'line',
            data: trendData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Presentations'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Financial Year'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        };

        const trendCtx = document.getElementById('trendChart');
        if (trendCtx) {
            new Chart(trendCtx.getContext('2d'), trendConfig);
        } else {
            console.error('Cannot find element with id "trendChart"');
        }

        // 保持按钮点击事件和其他交互代码不变
        const buttons = document.querySelectorAll('.nav-button');
        const title = document.querySelector('.title');
        const subtitle = document.querySelector('.subtitle');
        const chartContainer = document.querySelector('.chart-container');
        const lineChartContainer = document.querySelector('.line-chart-container');
        const imageContainer = document.querySelector('.image-container');
        const iconLegend = document.querySelector('.icon-legend');

        if (buttons.length && title && subtitle && chartContainer && lineChartContainer && imageContainer && iconLegend) {
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    const chartType = button.getAttribute('data-chart');

                    if (chartType === 'body') {
                        title.textContent = '🩹 What part of the body was sunburnt?';
                        subtitle.textContent = "Let's see what part of body sun protection is most crucial.";
                        chartContainer.style.display = 'none';
                        lineChartContainer.style.display = 'none';
                        imageContainer.style.display = 'flex';
                        iconLegend.style.display = 'none';
                    } else if (chartType === 'location') {
                        title.textContent = '☀️ Where kids tend to get sunburnt';
                        subtitle.textContent = "Let's take a look at where you should pay special attention to sun protection.";
                        chartContainer.style.display = 'block';
                        lineChartContainer.style.display = 'none';
                        imageContainer.style.display = 'none';
                        iconLegend.style.display = 'flex';
                    } else if (chartType === 'trend') {
                        title.textContent = '📈 Sunburn trend over years';
                        subtitle.textContent = "Let's examine how sunburn cases have changed over the years.";
                        chartContainer.style.display = 'none';
                        lineChartContainer.style.display = 'block';
                        imageContainer.style.display = 'none';
                        iconLegend.style.display = 'none';
                    } else {
                        chartContainer.style.display = 'block';
                        lineChartContainer.style.display = 'none';
                        imageContainer.style.display = 'none';
                        iconLegend.style.display = 'none';
                    }
                });
            });
        } else {
            console.error('One or more required elements are missing');
        }

        // 保持身体部位数据和交互代码不变
        const sunburnData = {
            "Head or face": {
                value: 55.2,
                range: [51.5, 58.8]
            },
            "Shoulders": {
                value: 33.7,
                range: [30.2, 37.3]
            },
            "Chest or back": {
                value: 16.9,
                range: [14.3, 19.8]
            },
            "Neck": {
                value: 20.1,
                range: [17.4, 23.2]
            },
            "Arms or hands": {
                value: 25.5,
                range: [22.5, 28.8]
            },
            "Legs or feet": {
                value: 11.2,
                range: [9.1, 13.7]
            }
        };

        const popup = document.querySelector('.data-popup');

        if (popup) {
            document.querySelectorAll('.annotation').forEach(annotation => {
                annotation.addEventListener('mouseenter', (e) => {
                    const part = annotation.getAttribute('data-part');
                    const data = sunburnData[part];
                    popup.innerHTML = `
                        <h3>% sunburnt</h3>
                        <p>Body part: ${part}</p>
                        <p>% (95% CI)</p>
                        <div class="data-bar" style="width: ${data.value}%;"></div>
                        <p>${data.value} (${data.range[0]}-${data.range[1]})</p>
                    `;

                    const annotationRect = annotation.getBoundingClientRect();
                    const containerRect = imageContainer.getBoundingClientRect();

                    const popupLeft = annotationRect.right - containerRect.left + 10;
                    const popupTop = annotationRect.top - containerRect.top;

                    popup.style.left = `${popupLeft}px`;
                    popup.style.top = `${popupTop}px`;
                    popup.style.display = 'block';
                });

                annotation.addEventListener('mouseleave', () => {
                    popup.style.display = 'none';
                });
            });
        } else {
            console.error('Cannot find element with class "data-popup"');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});