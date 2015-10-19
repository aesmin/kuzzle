var
  should = require('should'),
  rewire = require('rewire'),
  PluginsManager = rewire('../../../../lib/api/core/pluginsManager');

describe('Plugins manager constructList', function () {

  var constructList;

  before(function () {
    constructList = PluginsManager.__get__('constructList');
  });

  it('should return an empty array if both plugins are empty', function () {
    should(constructList({}, {})).empty().Object();
  });

  it('should merge default plugins and custom plugins', function () {
    var
      customPlugins = {
        foo: {
          url: 'bar'
        }
      },
      defaultPlugins = {
        bar: {
          url: 'qux'
        }
      },
      mergedPlugins;

    mergedPlugins = constructList(defaultPlugins, customPlugins, true);
    should(mergedPlugins.foo).be.Object();
    should(mergedPlugins.bar).be.Object();
  });

  it('should copy the default configuration into configuration', function () {
    var
      customPlugins = {
        foo: {
          url: 'foo',
          defaultConfig: {
            bar: 'bar'
          }
        }
      },
      defaultPlugins = {
        bar: {
          url: 'bar',
          defaultConfig: {
            qux: 'qux'
          }
        }
      },
      mergedPlugins;

    mergedPlugins = constructList(defaultPlugins, customPlugins, true);

    should(mergedPlugins.foo.config).be.Object();
    should(mergedPlugins.foo.config).have.property('bar');

    should(mergedPlugins.bar.config).be.Object();
    should(mergedPlugins.bar.config).have.property('qux');
  });

  it('should add the custom configuration from custom plugins', function () {
    var
      customPlugins = {
        foo: {
          url: 'foo',
          defaultConfig: {
            bar: 'bar'
          }
        },
        bar: {
          url: 'bar',
          defaultConfig: {
            qux: 'qux'
          },
          customConfig: {
            qux2: 'qux2'
          }
        }
      },
      defaultPlugins = {
        bar: {
          url: 'bar',
          defaultConfig: {
            qux: 'qux'
          }
        }
      },
      mergedPlugins;

    mergedPlugins = constructList(defaultPlugins, customPlugins, true);

    should(mergedPlugins.foo.config).be.Object();
    should(mergedPlugins.foo.config).have.property('bar');

    should(mergedPlugins.bar.config).be.Object();
    should(mergedPlugins.bar.config).have.property('qux');
    should(mergedPlugins.bar.config).have.property('qux2');
  });

  it('should override the default configuration by the custom configuration from custom plugins', function () {
    var
      customPlugins = {
        foo: {
          url: 'foo',
          defaultConfig: {
            bar: 'bar'
          }
        },
        bar: {
          url: 'bar',
          defaultConfig: {
            qux: 'qux'
          },
          customConfig: {
            qux: 'qux2'
          }
        }
      },
      defaultPlugins = {
        bar: {
          url: 'bar',
          defaultConfig: {
            qux: 'qux'
          }
        }
      },
      mergedPlugins;

    mergedPlugins = constructList(defaultPlugins, customPlugins, true);

    should(mergedPlugins.foo.config).be.Object();
    should(mergedPlugins.foo.config).have.property('bar');

    should(mergedPlugins.bar.config).be.Object();
    should(mergedPlugins.bar.config).have.property('qux');
    should(mergedPlugins.bar.config.qux).be.exactly('qux2');
  });

  it('should add custom config directly if there is no default config', function () {
    var
      customPlugins = {
        foo: {
          url: 'foo',
          customConfig: {
            bar: 'bar'
          }
        }
      },
      defaultPlugins = {},
      mergedPlugins;

    mergedPlugins = constructList(defaultPlugins, customPlugins, true);

    should(mergedPlugins.foo.config).be.Object();
    should(mergedPlugins.foo.config).have.property('bar');
  });
});