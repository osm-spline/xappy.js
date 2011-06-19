if (module == require.main) {
  return require('async_testing').run(__filename, process.ARGV);
}

var createTowInjectors = function() {
        var injector = require('../lib/injector.js');
        var injector2 = require('../lib/injector.js');

        return { first : injector, second : injector2 };
};

module.exports = {
    'basicInjectorTest': function(test) {

        var injectors = createTowInjectors();
        impl = injectors.first.getImplementations();
        impl2 = injectors.second.getImplementations();

        impl.test = 'test';

        test.equal(impl.test,impl2.test,'Mismatch between tow injectors');
        test.finish();
    },

    'requireInjectorTest': function(test) {
        var injectors = createTowInjectors();
        injectors.first.getImplementations().test = 't';

        test.equal('t',injectors.second.require('test'),'require() broken');
        test.finish();
    },

    'requireForwarding': function(test) {
        var injector = require('../lib/injector.js');

        delete injector.getImplementations.http;

        test.deepEqual(require('http'),injector.require('http'),
                'injector.require is no drop in replacment');
        test.finish();
    }
};

