<template>
  <div class="line1">
    <div id="main" class="" style="width: 90%;height:450px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
export default {
  name: "Tendency",
  props:['sevenDay','sevenData'],
  created() {
    console.log(this.sevenData[2])
  },
  mounted() {
    var chartDom = document.getElementById('main');
    this.myChart = echarts.init(chartDom);
    this.initData()

  },
  methods: {
    initData() {
      var option;

      option = {
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新注册用户', '新增订单', '新增管理员']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.sevenDay
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '新注册用户',
            type: 'line',
            data: this.sevenData[0],

          },
          {
            name: '新增订单',
            type: 'line',
            data: this.sevenData[1]
          },
          {
            name: '新增管理员',
            type: 'line',
            data: this.sevenData[2]
          },

        ]
      };

      option && this.myChart.setOption(option);

    }
  },
  //当sevenData和sevenDay发生改变时，立即执行函数
  watch: {
    sevenData: function (){
      this.initData()
    },
    sevenDay: function (){
      this.initData()
    }
  }
}
</script>

<style scoped>

</style>