//A single connection between neurons
export class Connection {

  //Get the input value
  get inputValue() {
    return this.neuron.value * this.weight;
  }

  constructor(neuron, weight) {
    this.neuron = neuron;
    this.weight = weight;
  }
}

//These neurons are in the hidden layers
export class Neuron {
  constructor(connections, bias) {
    this.connections = connections;
    this.bias = bias;
    this.value = 0;
  }

  //Update the value
  updateValue() {
    this.value = this.connections.reduce(c => c.in);
  }
}

export class EntryNeuron {
  constructor(value, bias) {
    this.value = value;
  }
}

export class ExitNeuron {
  constructor(connections) {
    this.value = 0;
  }
}
