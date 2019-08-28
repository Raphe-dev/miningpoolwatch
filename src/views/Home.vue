<template>
  <div>
      <form>
        <div class="w-100 d-flex justify-content-between" >
          <div class="p-2">
            <label for="inputAddress" class="sr-only">Address</label>
            <select id="inputAddress" class="form-control" v-model="form.pool">
              <option :value="null" disabled hidden>Select mining pool</option>
              <option value="ethermine">Ethermine</option>
              <option value="supportxmr">Supportxmr</option>
            </select>
          </div>
          <div class="flex-grow-1 p-2">
            <input type="text" class="form-control" placeholder="Address" v-model="form.address">
          </div>
          <div class="p-2">
          <button class="btn btn-dark" @click="add()">Add</button>
          </div>
        </div>
      </form>

      <div class="p-2 d-flex justify-content-around flex-wrap" v-if="ready">
        <component v-for="(miner, key) in $store.state.userdata" 
          :is="miner.pool"
          :key="key"
          :arrKey="key" 
          :address="miner.address" 
          :data="miner.data"/>
      </div>
  </div>
</template>

<script>
import Ethermine from '@/components/Ethermine.vue'
import Supportxmr from '@/components/Supportxmr.vue'

export default {
  name: 'home',
  components: {
    Ethermine,
    Supportxmr
  },
  data() {
    return {
      form: {
        pool: null,
        address: null
      }
    }
  },
  mounted() {
    this.$store.dispatch('getMinerData')

    setInterval(() => {
      this.$store.dispatch('getMinerData')
    }, 5 * 1000 * 60)
  },
  computed: {
    ready(){
      let r
      this.$store.state.userdata.forEach(i => {
        if(i.data){
          r = true
        } else {
          r = false
        }
      })
      return r;
    }
  },
  methods: {
    add(){
      if(this.form.pool && this.form.address){
        this.$store.commit('addPool', this.form)
        this.form = {
          pool: null,
          address: null
        }
        this.$store.dispatch('getMinerData')
      }
    }
  }
}
</script>
