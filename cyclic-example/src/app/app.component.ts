import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
// @ts-ignore
import * as cyclicAxisPlugin from 'chartjs-plugin-cyclic-axis';

Chart.register(...registerables);
Chart.register(cyclicAxisPlugin);
Chart.register(zoomPlugin);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'chart.js plugin Cyclic Axis Example';
  data = [] as any;
  name = 'Angular   6';
  canvas: any;
  pointerStyleData = [];
  myChart: Chart | undefined;
  currPoint: any = null;
  ctx: any;

  @ViewChild('mychart') mychart: any;

  constructor() {
  }

  ngAfterViewInit() {
    const data = {
      datasets: [{
        label: 'Scatter Dataset',
        data: this.generateRandomPoints(20),
        backgroundColor: 'rgb(255, 99, 132)'
      }],
    };

    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'scatter',
      data: data,
      options: {
        scales: {
          x: {
            display: true,
            type: 'cyclicAxis' as any,
            min: -180,
            max: 180,
            rightValue: 180,
            cyclicPanning: true,
            ticks: {
              stepSize: 5,
            } as any,
          } as any,
        },
        plugins: {
          zoom: {
            pan: {
              // pan options and/or events
              enabled: true,
              mode: 'x',
              overScaleMode: 'x',
            },
            limits: {
              // axis limits
              y: {min: 0, max: 100},
              x: {min: -180, max: 180},
            },
            zoom: {
              // zoom options and/or events
              mode: 'y',
              wheel: {
                enabled: true,
              },
            }
          },
        }
      }
    });
  }

  generateRandomPoints(num: number): any[] {
    const data = [];
    while (num > 0) {
      num--;
      data.push({
        x: (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 180),
        y: Math.floor(Math.random() * 100) + 1,
        shape: 'circle',
      });
    }
    return data;
  }
}
