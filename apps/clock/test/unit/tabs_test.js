'use strict';

suite('Tabs', function() {
  var Tabs;

  suiteSetup(function(done) {
    require(['tabs'], function(tabs) {
      Tabs = tabs;
      done();
    });
  });

  setup(function() {
    this.element = document.createElement('div');
    this.element.innerHTML =
      '<li aria-selected="true"><a href="#link-0"></a></li>' +
      '<li><a href="#link-1"></a></li>' +
      '<li><a href="#link-2"></a></li>' +
      '<li><a href="#link-3"></a></li>';
    this.links = this.element.querySelectorAll('a');
    this.tabs = new Tabs(this.element);
  });

  suite('test click link 1', function() {
    setup(function() {
      this.links[0].click();
    });
  });
  suite('test click link 2', function() {
    setup(function() {
      this.links[1].click();
    });
    test('test aria-selected set', function() {
      ['false', 'true', 'false'].forEach(function(value, index) {
        assert.equal(this.links[index].getAttribute('aria-selected'), value);
      }, this);
    });
  });
});
