const base = require('./base');
const util = require('../util');
const { InputMissing } = require('./errors');


const callable = nodeFactoryOrClass => {
  return inputs => {
    inputs = inputs || {};
    return new Promise((resolve, reject) => {
      let node = util.buildFromFactoryOrClass(nodeFactoryOrClass);

      for (let [output, pin] of Object.entries(node.pins.out)) {
        pin.subscribe(base.io.IOPinEvents.send, data => {
          resolve({
            output: output,
            data: data,
            node: node,
          });
        });
      }

      for (let [control, pin] of Object.entries(node.pins.controlOut)) {
        pin.subscribe(base.pin.PinEvents.activate, () => {
          resolve({
            control: control,
            node: node,
          });
        });
      }

      node.subscribe(base.node.NodeEvents.promised, promise => {
        promise.catch(error => {
          reject(error);
        });
      });

      node.subscribe(base.node.NodeEvents.error, error => {
        reject(error);
      });

      if (Object.entries(node.pins.in).length == 0) {
        node.checkActivate();
      }
      else {
        for (let [input, pin] of Object.entries(node.pins.in)) {
          if (!(input in inputs))
            throw new InputMissing(input, inputs);

          node.pins.in[input].receive(inputs[input]);
        }
      }
    });
  }
}

module.exports = callable;
