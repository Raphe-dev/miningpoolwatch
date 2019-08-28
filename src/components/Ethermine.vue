<template>
  <div>
    <div v-if="stats">
      <div class="row">
        <span class="col text-left ml-2">
          <small > Workers </small>
        </span>
        <big class="col"> {{stats.currentStatistics.activeWorkers}}</big>
      </div>

      <div class="row">
        <span class="col text-left ml-2">
          <small > Reported hashrate </small>
        </span>
        <big class="col"> {{reported.primary}}<small>{{reported.secondary}}</small> Mh/s </big>
      </div>

      <div class="row">
        <span class="col text-left ml-2">
          <small > Average hashrate </small>
        </span>
        <big class="col"> {{average.primary}}<small>{{average.secondary}}</small> Mh/s </big>
      </div>

      <div class="row">
        <span class="col text-left ml-2">
          <small > Current hashrate </small>
        </span>
        <big class="col"> {{current.primary}}<small>{{current.secondary}}</small> Mh/s </big>
      </div>

      <div class="row">
        <span class="col text-left ml-2">
          <small > Amount due </small>
        </span>
        <big class="col"> {{due}} </big>
      </div>
      <canvas id="ethermineChart" width="100" height="50" ></canvas>
      <div class="pt-4">
        <div class="progress position-relative" style="height:2rem;">
          <div 
            class="progress-bar progress-bar-striped text-dark text-center"
            :class="{ 'progress-bar-animated bg-success' : reported.primary > 1 }" 
            role="progressbar" 
            :style="{width: this.progress + '%'}"
            :tooltip="this.progress"
            > 
            <span class="justify-content-center d-flex position-absolute w-100">{{this.progress}} %</span>
          </div>
        </div>
        <p class="card-text text-right"><span style="font-size:0.6rem;">{{updatedAt}}</span></p>
      </div>
    </div>

    <div v-else class="text-danger"> error </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
export default {
  name: 'ethermineCard',
  props: {
    data: Object,
    address: String,
    arrKey: Number
  },
  data: () => {
    return {
      chart: null
    }
  },
  computed: {
    stats() {
      if(Object.entries(this.data).length > 0) {
        return this.data
      } else {
        return false
      }
    },
    reported(){
      let result = (this.stats.currentStatistics.reportedHashrate / 1000000).toFixed(3)
      return this.parseFloatString(result)
    },
    current(){
      let result = (this.stats.currentStatistics.currentHashrate / 1000000).toFixed(3)
      return this.parseFloatString(result)
    },
    average() {
      var value = 0;
      for(let i = 0; i < this.stats.statistics.length; i++){
        value += this.stats.statistics[i].reportedHashrate
      }
      value = ((value / this.stats.statistics.length) / 1000000).toFixed(3) 
      return this.parseFloatString(value)
    },
    due(){
      let len = this.stats.currentStatistics.unpaid.toString().length
      return (this.stats.currentStatistics.unpaid / 1000000000000000000).toFixed(8)
    },
    payout(){
      return this.stats.settings.minPayout / 1000000000000000000
    },
    progress() {
      return ((this.due / this.payout) * 100).toFixed(2)
    },
    updatedAt(){
      let timestamp = this.stats.statistics[this.stats.statistics.length - 1].time*1000
      let date = new Date(timestamp)
      return date.toLocaleString() 
    }
  },
  mounted(){
    if(Object.entries(this.data).length > 0){
      this.generateChart()
    }
  },
  methods: {
    generateChart(){
      let reportedHashrates = []
      let diff = []
      let times = []
      for(let i = 0; i < this.stats.statistics.length; i++){
        let timestamp = this.stats.statistics[i].time*1000
        let date = new Date(timestamp)
        times.push(date.toLocaleString())
        reportedHashrates.push((this.stats.statistics[i].reportedHashrate / 1000000).toFixed(3))
        diff.push((this.stats.statistics[i].currentHashrate / 1000000).toFixed(3) )
      }
      let canva = document.getElementById('ethermineChart').getContext('2d');
      this.chart = new Chart(canva, {
        type: 'line',
        data: {
          labels: times,
          datasets: [{
            label: "reported Mh/s",
            data: reportedHashrates,
            pointRadius: 0,
            hitRadius: 5,
            borderColor: 'black',
            borderWidth: 1,
            hoverRadius: 0,
            stepped: true,
            fill: false,
          }, {
            label: "current Mh/s",
            data: diff,
            pointRadius: 0,
            hitRadius: 5,
            borderColor: 'blue',
            borderWidth: 0.25,
            hoverRadius: 0,
            stepped: false,
            fill: false,
          }]
        },options: {
          legend: {
            display: false,
          },
          scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
              display: true
            }]
        }
        }
      });
    },
    removeCard(){
      this.$store.commit('removePool', this.arrKey)
    },
    parseFloatString(str){
      let primary = str.substr(0, str.indexOf('.'));
      let secondary = str.substr(str.indexOf('.'), str.length);
      return { primary, secondary }
    }
  }
}
</script>
