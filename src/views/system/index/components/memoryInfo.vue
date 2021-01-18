<template>
  <ve-line
    :extend="extend"
    :data="chartData"
    :settings="chartSettings"
  />
</template>

<script>
import { memoryInfo } from '@/api/redis'

export default {
  data () {
    return {
      interval: null,
      chartSettings: {
        xAxisType: 'time',
        yAxisName: ['( kb )'],
        scale: [true, true]
      },
      chartData: {
        columns: ['时间', '内存占用'],
        rows: []
      },
      extend: {
        grid: { left: 15, right: 24, bottom: 40, top: 60, containLabel: true },
        legend: { show: false },
        xAxis: {
          axisLabel: {
            formatter: value => {
              return this.$moment(value).format('HH:mm')
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getData()
      this.interval = setInterval(this.getData, 3000)
    },
    getData () {
      if (this.chartData.rows.length > 20) {
        this.chartData.rows.shift()
      }
      memoryInfo().then(res => {
        const data = res.data
        this.chartData.rows.push({
          '时间': data.create_time,
          '内存占用': data.used_memory
        })
      })
    }
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>
