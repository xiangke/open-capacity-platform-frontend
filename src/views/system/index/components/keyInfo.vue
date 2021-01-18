<template>
  <ve-line
    :extend="extend"
    :data="chartData"
    :settings="chartSettings"
  />
</template>

<script>
import { keysSize } from '@/api/redis'

export default {
  data () {
    return {
      interval: null,
      chartSettings: {
        xAxisType: 'time',
        scale: [true, true]
      },
      chartData: {
        columns: ['时间', 'keys'],
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
      keysSize().then(res => {
        const data = res.data
        this.chartData.rows.push({
          '时间': data.create_time,
          'keys': data.dbSize
        })
      })
    }
  },
  destroyed () {
    clearInterval(this.interval)
  }
}
</script>
