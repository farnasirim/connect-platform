const { JSONScenario } = require('./json-scenario');
const { ScenarioEvents } = require('./scenario');
const { ConsoleWatcher } = require('./console-watcher');
const { Recorder } = require('./recorder');

module.exports = (json, inputs, configs) => {
  return new Promise((resolve, reject) => {
    let cwatcher = new ConsoleWatcher();
    let scenario = new JSONScenario(json, inputs, configs).subscribe(ScenarioEvents.prepared, () => {
      scenario.watcher().mount('console', cwatcher.watch(console));
    });
    let recorder = new Recorder().finished(() => {
      cwatcher.unhook(console);
      resolve(recorder.recording);
    }).record(scenario);
  });
}
