# highcharts

### Install

```
npm install highcharts --save
```

### Usage

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>highcharts Web Component</title>
    <script type="module" src="./main.ts"></script>
  </head>
  <body>
    <div id="app"></div>
    <wc-highcharts
      style="display: block; height: 500px; background: #f5f5f5"
    ></wc-highcharts>

    <script type="module">
      const highcharts = document.querySelector("wc-highcharts");
      const options = {
        accessibility: {
          enabled: false,
        },
        credits: { enabled: false },
        chart: {
          type: "pie",
          backgroundColor: "rgba(0,0,0,0)",
          options3d: {
            enabled: true,
            alpha: 50,
          },
        },
        legend: {
          align: "left",
          verticalAlign: "top",
          itemStyle: {
            color: "#fff",
            fontSize: "14px",
            lineHeight: "30px",
          },
          enabled: false,
        },
        title: false,
        plotOptions: {
          pie: {
            innerSize: 50,
            depth: 40,
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format:
                "<b>{point.name}</b>({point.y})<br \> {point.percentage:.1f}%",
            },
            showInLegend: true,
          },
        },
        series: [
          {
            name: "数量",
            data: [
              ["活跃", 100],
              ["不活跃", 200],
            ],
          },
        ],
      };
      highcharts.setOptions(options);
    </script>
  </body>
</html>
```
