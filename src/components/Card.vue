<template>
  <div class="flex-grow-1 p-2" style="width:18rem; max-width:40rem;">
    <div class="card bg-light" style="min-height:30rem;">
      <div class="card-header">
        <h5 class="card-title m-0 text-capitalize">{{component}}</h5>
        <small> {{address.substring(0,3)}}...{{address.substring(address.length - 3, address.length)}} </small>
        <span style="position:absolute; top:0.5rem; right:0.5rem;"> 
          <button class="btn-sm btn" style="width:2rem;" @click="removeCard()">X</button> 
        </span>
      </div>
    <div class="card-body p-1">
        <component
          :is="component"
          :arrKey="arrKey" 
          :address="address" 
          :data="data"
        />
    </div>
  </div>
</div>
</template>

<script>
import Ethermine from '@/components/Ethermine.vue'
import Supportxmr from '@/components/Supportxmr.vue'

export default {
  name: 'miner-card',
  components: {
    Ethermine,
    Supportxmr
  },
  props: {
    component: String,
    data: Object,
    address: String,
    arrKey: Number
  },
  methods: {
    removeCard(){
      this.$store.commit('removePool', this.arrKey)
    }
  }
}
</script>
