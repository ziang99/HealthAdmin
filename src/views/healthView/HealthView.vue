<template>
  <div class="HealthView">
    <div class="aaa" ref="pieBox"></div>
    <div class="bbb" ref="barBox"></div>
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require("echarts/lib/echarts");
  // 引入饼图和柱状图
  require("echarts/lib/chart/pie");
  require("echarts/lib/chart/bar");
  // 引入所需组件
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");
  require("echarts/lib/component/legend");
  // 引入请求数据
  import { getHealthFrom } from "network/healthFrom";
  import { getBarInfo } from "network/healthFrom";
  export default {
    name: "HealthView",
    data() {
      return {
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        level6: 0,
        // 
        barInfo: []
      };
    },
    mounted() {
      // 绘制饼图
      this.getPie()
      // 绘制柱状图
      this.getBar()
    },
    methods: {
      async getPie() {
        // 获取并转化数据
        let res = await getHealthFrom();
        // console.log(res.data)
        let level1 = [],
          level2 = [],
          level3 = [],
          level4 = [],
          level5 = [],
          level6 = [];
        for (const i of res.data) {
          let disLength = i.temperature.length;
          let str = i.temperature.substring(0, disLength - 1);
          let numStr = Number(str);
          if (numStr < 35) {
            level1.push(numStr);
            this.level1 = Number(level1.length);
          } else if (numStr >= 35 && numStr < 36) {
            level2.push(numStr);
            this.level2 = Number(level2.length);
          } else if (numStr >= 36 && numStr < 37) {
            level3.push(numStr);
            this.level3 = Number(level3.length);
          } else if (numStr >= 37 && numStr < 38.5) {
            level4.push(numStr);
            this.level4 = Number(level4.length);
          } else if (numStr >= 38.5 && numStr < 39.5) {
            level5.push(numStr);
            this.level5 = Number(level5.length);
          } else if (numStr >= 39.5) {
            level6.push(numStr);
            this.level6 = Number(level6.length);
          }
        }
        // 饼图
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs.pieBox);
        // 绘制图表
        myChart.setOption({
          title: {
            text: "人员体温统计图",
            left: "center",
            top: 10
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            borderColor: "#657DE9",
            orient: "vertical",
            left: "left",
            data: [
              "39.5℃以上",
              "38.5℃~39.5℃",
              "37℃~38.5℃",
              "36℃~37℃",
              "35℃~36℃",
              "35℃以下"
            ]
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: "55%",
              center: ["50%", "62%"],
              data: [
                { value: this.level6, name: "39.5℃以上" },
                { value: this.level5, name: "38.5℃~39.5℃" },
                { value: this.level4, name: "37℃~38.5℃" },
                { value: this.level3, name: "36℃~37℃" },
                { value: this.level2, name: "35℃~36℃" },
                { value: this.level1, name: "35℃以下" }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        });
      },
      async getBar() {
        // 获取并转化数据
        let res = await getBarInfo();
        // console.log(res.data)
        if(res.code === 200){
          this.barInfo = res.data
        }else{
          this.$message.error({
            message: "症状统计图加载失败",
            center: true,
            showClose: true
          });
        }
        // 基于准备好的dom，初始化echarts实例
        var myChartBar = echarts.init(this.$refs.barBox);
        // 绘制图表
        myChartBar.setOption({
          grid:{
            x:50,
            y:90,
            x2:60,
            y2:50
          },
          title: {
            text: "人员症状统计图",
            left: "center",
            top: 10
          },
          tooltip: {
            trigger: "axis",
            showContent: false,
            axisPointer: {
              type: 'shadow',
            }
          },
          xAxis: {
            name: '(调查项)',
            type: "category",
            data: ["接触过疑似", "感冒等症状", "呕吐等症状", "逗留风险区"],
          },
          yAxis: {
            name: '(人数)',
            type: "value"
          },
          series: [
            {
              data: this.barInfo,
              type: "bar",
              barWidth : 40,
              label:{
                show: true,
                position: [10, 10],
                color: '#fff'
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 1, 0, 0,   // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
                    [
                      {offset: 1, color: '#c23531'},  
                      {offset: 0, color: '#fff'}
                    ]
                )
                }
              },
            }
          ]
        });
      }
    },
  };
</script>

<style scoped>
  .HealthView{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .aaa, .bbb{
    width: 500px;
    height: 400px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
  }
</style>