import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { from } from 'rxjs';
import { HttpService } from './http.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('result', { static: true }) result;
  constructor(
    private httpService: HttpService,
    private el:ElementRef
  ) { }
  title = 'pactice';
  public dataBase: any[];
  public dataScene: any[];
  selectedBase: string = '';
  selectedScene: string = '';
  public myChart: any;
  public colorSet: Object;
  active: boolean = false;
  public keyword = '';
  loading:Boolean= false;
  ngOnInit(): void {
    this.init()
  }
  onChartInit(ec: any): void {
    this.myChart = ec
    this.myChart.on('click',(params:any)=>{
      this.resetOption(params.data.id)
    })
  }
  //获取下拉框数据
  init(): void {
    this.httpService.initData().subscribe(data1 => this.dataBase = data1.datastoreNames)
  }
  //下拉框选中
  selectedOptionDatabase(value: any): void {
    this.dataScene = []
    this.selectedScene = ''
    this.selectedBase = value;
    this.httpService.getScenarios(value).subscribe(data => this.dataScene = data.scenarioNames)
  }
  selectedOptionDataScene(value: string): void {
    let dat = {
      datastoreName: this.selectedBase,
      scenarioName: value
    }
    this.getColors(dat)

    this.httpService.getVisulize(dat).subscribe(data => {
      this.resetchart(data)
    })
  }
  getColors(obj: Object): void {
    this.httpService.getColors(obj).subscribe(data => {
      this.chartOption.series[0].itemStyle.color = (params: any) => {
        let flag = /^#([A-F\d]{6}|[A-F\d]{3})$/i.test(data.entityColorConfig[params.data.label])
        if (data.entityColorConfig[params.data.label] === null) {
          return '#FF0000'
        } else if (flag) {
          return data.entityColorConfig[params.data.label]//
        } else {
          return '#c0c0c0'
        }
      }
    })
  }
  getResult(keyword: string) {
    this.keyword = keyword
    let params = {
      datastoreName: this.selectedBase,
      keyword: keyword
    }
    this.result.getResult(params)
  }
  resetOption(id: string): void {
    let params = {
      id,
      datastoreName: this.selectedBase
    }
    this.httpService.getRelations(params).subscribe(data => {
      this.resetchart(data)
    })
  }
  resetchart(dat: any): void {
    this.chartOption.series[0].links = dat.relations.map((x:any) => {
      return {
        source: x.sourceId,
        target: x.targetId,
        value: x.value
      }
    })
    this.chartOption.series[0].data = dat.nodes.map((x:any) => {
      return {
        id: x.id,
        name: x.name,
        label: x.label,
        x: null,
        y: null,
      }
    })
    this.myChart.setOption(this.chartOption)
  }
  //echart 配置
  chartOption = {
    color:['#c0c0c0'],
    title: {
      text: ''
    },
    tooltip: {
      show: false
    },
    legend: {},

    series: [
      {
        type: 'graph',
        layout: 'force',
        edgeSymbol: ['none', 'arrow'],
        force: {
          repulsion: 500,
          edgeLength: [100, 150]
        },
        data: [],
        links: [],
        categories: [],
        roam: true,
        focusNodeAdjacency: true,
        itemStyle: {
          color:(params:any)=> '#c0c0c0' ,
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        // symbol:'none',
        symbolSize: 30,
        label: {
          show: true,
          position: 'bottom',
          formatter: '{b}',
          color: '#000'
        },
        edgeLabel: {
          show: true,
          position: 'middle',
          formatter: (params: any) => {
            return params.value
          }
        },
        lineStyle: {
          color: '#000',
          curveness: 0.1,

        },
        emphasis: {
          lineStyle: {
            width: 1
          }
        }
      }
    ]
  }
}
