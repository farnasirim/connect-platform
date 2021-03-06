const { fromJSON } = require('../builder');
const { Composition } = require('../builder/composition');

const { CompositionScenario } = require('./composition-scenario');


class JSONScenario extends CompositionScenario {
  constructor(json, inputs, configs) {
    super(undefined, inputs, configs);
    this.recipe = fromJSON(json);
  }

  prepare() {
    this.composition = new Composition();
    this.recipe.apply(this.composition);

    return super.prepare();
  }
}

module.exports.JSONScenario = JSONScenario;
