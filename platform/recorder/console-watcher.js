const util = require('util');

const { Subscribable } = require('../core/base/subscribable');

const { WatcherEvents, Watcher } = require('./watcher');


const ConsoleEvents = {
  log: 'log',
  info: 'info',
  error: 'error',
  warn: 'warn',
  debug: 'debug',
}

class ConsoleWatcher extends Watcher {
  constructor() {
    super(ConsoleEvents);
  }

  watch(console) {
    console._oldlog = console.log;
    console._olderror = console.error;
    console._oldwarn = console.warn;
    console._olddebug = console.debug;
    console._oldinfo = console.info;

    let subject = new Subscribable();

    console.log = (...log) => {
      console._oldlog(...log);
      subject.publish(ConsoleEvents.log, util.format(...log));
    }

    console.error = (...error) => {
      console._olderror(...error);
      subject.publish(ConsoleEvents.error, util.format(...error));
    }

    console.warn = (...warn) => {
      console._oldwarn(...warn);
      subject.publish(ConsoleEvents.warn, util.format(...warn));
    }

    console.debug = (...debug) => {
      console._oldwarn(...debug);
      subject.publish(ConsoleEvents.debug, util.format(...debug));
    }

    console.info = (...info) => {
      console._oldwarn(...info);
      subject.publish(ConsoleEvents.info, util.format(...info));
    }

    return super.watch(subject);
  }

  unhook(console) {
    console.log = console._oldlog || console.log;
    console.error = console._olderror || console.error;
    console.warn = console._oldwarn || console.warn;
    console.debug = console._olddebug || console.debug;
    console.info = console._oldinfo || console.info;

    return this;
  }
}

module.exports = {
  ConsoleWatcher: ConsoleWatcher,
  ConsoleEvents: ConsoleEvents,
}
