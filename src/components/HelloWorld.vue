<template>
  <div class="container">
    <b-modal v-model="addVortixModal" @ok="addNode"
      >Inserte el nombre del Nodo:
      <b-form-input
        class="mt-2"
        v-model="nodeName"
        placeholder="Por ejemplo: un lugar geografico"
      ></b-form-input>
    </b-modal>
    <b-modal v-model="showError" size="sm" title="Error!" ok-only>
      <p class="my-1">
        Ya existe este record, por favor escoge otro destino diferente!!!
      </p>
    </b-modal>

    <b-modal
      v-model="showResult"
      size="lg"
      title="Resultado!!!!"
      ok-only
      @ok="showResult = false"
    >
      <h1>
        El camino más corto a tomar desde: {{ this.targetOrigin }} hasta
        {{ this.targetDestination }} es:
      </h1>
      <span v-for="(item, index) in result" :key="index">
        {{ item }} ---------
      </span>
    </b-modal>

    <b-modal v-model="addWeightModal" @ok="addWeight">
      Adicionar peso:
      <b-container>
        <b-row>
          <b-col cols="12">
            <label for="originNode">Origen:</label>
            <b-form-select
              v-model="originNode"
              :options="nodes"
            ></b-form-select>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <label for="destinationNode">Destino:</label>
            <b-form-select
              v-model="destinationNode"
              :options="destinations"
              size="sm"
              class="mt-3"
            ></b-form-select>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col cols="12">
            <label for="destinationValue">Peso:</label>
            <b-form-input
              type="number"
              class="mt-2"
              v-model="weight"
              placeholder="Inserte un valor numerico"
            ></b-form-input>
          </b-col>
        </b-row>

        <b-table striped hover :items="vortex">
          <template #cell(acciones)="data">
            <b-button @click="deleteWeight(data.item)" variant="danger"
              >Eliminar</b-button
            >
          </template>
        </b-table>

        <b-row>
          <b-button class="ml-3 mt-3" @click="addPath" variant="primary"
            >Adicionar camino</b-button
          >
        </b-row>
      </b-container>
    </b-modal>

    <h1>Investigación de Operaciones - Árbol de Expansión Mínima</h1>

    <div>
      El algoritmo de Dijkstra, también llamado algoritmo de caminos mínimos, es
      un algoritmo para la determinación del camino más corto, dado un vértice
      origen, hacia el resto de los vértices en un grafo que tiene pesos en cada
      arista. Su nombre alude a Edsger Dijkstra, científico de la computación de
      los Países Bajos que lo concibió en 1956 y lo publicó por primera vez en
      1959.1​2​ La idea subyacente en este algoritmo consiste en ir explorando
      todos los caminos más cortos que parten del vértice origen y que llevan a
      todos los demás vértices; cuando se obtiene el camino más corto desde el
      vértice origen hasta el resto de los vértices que componen el grafo, el
      algoritmo se detiene. Se trata de una especialización de la búsqueda de
      costo uniforme y, como tal, no funciona en grafos con aristas de coste
      negativo (al elegir siempre el nodo con distancia menor, pueden quedar
      excluidos de la búsqueda nodos que en próximas iteraciones bajarían el
      costo general del camino al pasar por una arista con costo negativo)
    </div>

    <div class="container mt-5">
      <b-button @click="addVortixModal = true" variant="primary"
        >Adicionar Arista</b-button
      >

      <div class="d-flex flex-wrap justify-content-center">
        <b-card
          v-for="(item, index) in nodes"
          :key="index"
          :title="item"
          style="max-width: 20rem"
          class="mb-2 mt-2 mr-2"
        >
          <b-card-text> Este es un nodo o vértice del grafo </b-card-text>

          <b-button @click="deleteNode(item)" variant="danger"
            >Eliminar</b-button
          >
        </b-card>
      </div>
    </div>

    <div class="container mt-5">
      <b-button
        :disabled="nodes.length === 0"
        @click="addWeightModal = true"
        variant="secondary"
        >Adicionar Peso</b-button
      >

      <div class="d-flex flex-wrap justify-content-center">
        <b-table striped hover :items="items">
          <template #cell(start)="data">
            {{ data.start }}
          </template>
          <template #cell(distances)="data">
            {{ data.distances }}
          </template>

          <template #cell(acciones)="data">
            <b-button @click="deleteWeight(data.item)" variant="danger"
              >Eliminar</b-button
            >
          </template>
        </b-table>
      </div>

      <b-row class="mt-2">
        <b-container>
          <b-row>
            <b-col cols="6">
              <label for="originNode">Desde:</label>
              <b-form-select
                v-model="targetOrigin"
                :options="nodes"
              ></b-form-select>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="6">
              <label for="destinationNode">Hasta:</label>
              <b-form-select
                v-model="targetDestination"
                :options="nodes.filter(node => node !== this.targetOrigin)"
                size="sm"
                class="mt-3"
              ></b-form-select>
            </b-col>
          </b-row>
          <b-button
            class="mb-5 mt-4"
            @click="submitData"
            size="lg"
            variant="success"
            >Calcular la ruta mas corta!</b-button
          >
        </b-container>
      </b-row>
      <!-- <b-row v-else-if="weights.length === 0">
        <h3>Ingresa peso en el grafo para poder calcular!</h3>
      </b-row>
      <b-row v-else>
        <h3>Ingresa mas de 1 peso en el grafo para poder calcular!</h3>
      </b-row> -->
    </div>
  </div>
</template>

<script>
import { Graph } from '../../src/helpers/shortestPath';
export default {
  name: 'HelloWorld',
  components: {},
  mounted() {},
  data() {
    return {
      count: 0,
      addVortixModal: false,
      addWeightModal: false,
      nodeName: null,
      nodes: ['A', 'B', 'C'],
      originNode: null,
      destinationNode: null,
      originValue: null,
      weight: null,
      weights: [],
      showError: false,
      targetOrigin: null,
      targetDestination: null,
      result: [],
      showResult: false,
      ammount: 0,
      vortex: []
    };
  },
  methods: {
    addPath() {
      this.vortex.push({
        start: this.originNode,
        distances: [
          {
            to: this.destinationNode,
            value: this.weight
          }
        ]
      });
    },
    addNode() {
      this.nodes.push(this.nodeName);
      this.nodeName = null;
    },
    deleteNode(index) {
      this.nodes = this.nodes.filter(item => item !== index);
    },
    addWeight() {
      let s = '';
      let d = [];
      for (let index = 0; index < this.vortex.length; index++) {
        const vortex = this.vortex[index];
        s = vortex.start;

        for (let index = 0; index < vortex.distances.length; index++) {
          const distances = vortex.distances[index];

          d.push(distances);
        }
      }
      console.log(d);
      let newObject = {};
      d.forEach(o => {
        newObject[o.to] = o.value;
      });

      this.weights.push({
        start: s,
        distances: newObject
      });

      this.vortex = [];
    },
    convertArrayToObject(array, key) {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item
        };
      }, initialValue);
    },
    deleteWeight(data) {
      let indexFound = 0;
      for (let i = 0; i < this.weights.length; i++) {
        if (
          this.weights[i].destination === data.destino &&
          this.weights[i].origin === data.origen &&
          this.weights[i].weight === data.peso
        )
          indexFound = i;
        break;
      }
      this.weights.splice(indexFound, 1);
    },
    submitData() {
      console.log('submiting data');
      const graph = new Graph();
      this.weights.forEach(w => {
        graph.addVertex(w.start, w.distances);
      });
      console.log(graph);
      console.log(
        graph
          .shortestPath(this.targetOrigin, this.targetDestination)
          .concat([this.targetOrigin])
          .reverse()
      );
      // const graph = new WeightedGraph();
      // this.nodes.forEach(node => {
      //   graph.addVertex(node);
      // });
      // this.weights.forEach(weight => {
      //   graph.addEdge(weight.origin, weight.destination, weight.weight);
      // });
      this.result = graph
        .shortestPath(this.targetOrigin, this.targetDestination)
        .concat([this.targetOrigin])
        .reverse();
      this.showResult = true;
    }
  },
  computed: {
    items() {
      return this.weights.map(weight => {
        return {
          origen: weight.start,
          destinos: weight.destinations,
          peso: weight.weight,
          acciones: ''
        };
      });
    },
    destinations() {
      return this.nodes.filter(node => node !== this.originNode);
    }
  }
};
</script>

<style scoped></style>
