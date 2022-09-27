<template>
  <b-modal :v-model="showModal" @ok="addVertex"
    >Inserte el nombre del Nodo:
    <b-form-input
      class="mt-2"
      v-model="nodeName"
      placeholder="Por ejemplo: un lugar geografico"
    ></b-form-input>
  </b-modal>
</template>

<script>
export default {
  name: 'VertexComponent',
  props: ['showModal'],
  data() {
    return {
      nodeName: null,
      show: false
    };
  },
  methods: {
    displayModal() {
      this.show = true;
    },
    addVertex() {
      console.log('Add vertex');
    }
  }
};
</script>

<style></style>
