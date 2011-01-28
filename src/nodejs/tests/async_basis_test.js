if (module == require.main) {
  return require('./node-async-testing/lib/async_testing').run(process.ARGV);
}

module.exports = {
  'test A': function(test) {
    test.ok(true);
    test.finish();
  },

  'test B': function(test) {
    test.ok(true);
    test.finish();
  },

  'test C': function(test) {
    test.ok(true);
    test.finish();
  },

  'test D': function(test) {
    test.ok(true);
    test.finish();
  }
};

