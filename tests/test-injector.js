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
        
        impl.database = 'test';

        test.equal(impl.database,impl2.database,'Mismatch between tow injectors');
        test.finish();
    },

    'requireInjectorTest': function(test) {
        var injectors = createTowInjectors();
        injectors.first.getImplementations().database = 't';
        
        test.equal('t',injectors.second.require('database'),'require() broken');
        test.finish();
    }
};

