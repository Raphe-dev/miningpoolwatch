<template>
  <div>
    <div v-if="current">
      <div class="row">
        <span class="col text-left">
          <small > Workers </small>
        </span>
        <big class="col">{{data.stats.workers}}</big>
      </div>

      <div class="row">
        <span class="col text-left">
          <small > Current hashrate </small>
        </span>
        <big class="col"> {{current}} H/s </big>
      </div>

      <div class="row">
        <span class="col text-left">
          <small > Average hashrate </small>
        </span>
        <big class="col"> {{average}} H/s </big>
      </div>

      <div class="row">
        <span class="col text-left">
          <small > Amount due </small>
        </span>
        <big class="col"> {{due}} </big>
      </div>
      <div class="row" style="margin: 0.9rem">
      </div>
      <canvas id="supportxmrChart" width="100" height="50"></canvas>
      <div class="pt-4">
        <div class="progress position-relative" style="height:2rem;">
          <div 
            class="progress-bar progress-bar-striped text-dark text-center"
            :class="{ 'progress-bar-animated bg-success' : current > 1 }" 
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
  name: 'supportxmr',
  props: {
    data: Object,
    address: String,
    arrKey: Number
  },
  computed: {
    current() {
      return this.data.stats.hash
    },
    average() {
      var value = 0;
      for(let i = 0; i < this.data.chart.length; i++){
        value += this.data.chart[i].hs
      }
      return ((value / this.data.chart.length)).toFixed(0)
    },
    due() {
      return (this.data.stats.amtDue / 1000000000000).toFixed(8)
    },
    progress() {
      return ((this.due / 0.1)*100).toFixed(2)
    },
    updatedAt() {
      return new Date(this.data.chart[0].ts).toLocaleString()
    }
  },

  mounted(){
    if(this.data && this.data.chart.length > 1){
      this.generateChart()
    }
  },
  methods: {
    generateChart(){
      let hash = []
      let times = []
      let date
      let timestamp
      for(let i = 0; i < this.data.chart.length; i++){
        timestamp = this.data.chart[i].ts
        date = new Date(timestamp)
        times.push(date.toLocaleString())
        hash.push(this.data.chart[i].hs)
      }
      let canva = document.getElementById('supportxmrChart').getContext('2d');
      this.chart = new Chart(canva, {
        type: 'line',
        data: {
          labels: times,
          datasets: [{
            label: "h/s",
            data: hash,
            pointRadius: 0,
            hitRadius: 10,
            borderColor: 'black',
            borderWidth: 0.5,
            hoverRadius: 0,
            stepped: true,
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
  }
}
</script>
