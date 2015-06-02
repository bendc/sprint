(function(){
	'use strict';

  jest.dontMock('../sprint.js');

	describe("$('.foo').add('.bar')", function() {
		it('should contain .foo', function() {
      var $ = require('../sprint');
      document.body.innerHTML =
        '<div>' +
        '  <div class="foo"></div>' +
        '  <div class="bar"></div>' +
        '</div>';
			var foo = $('.foo').add('.bar').dom[0];
			var foo_node = $('.foo').dom[0];
			expect(foo).toBe(foo_node);
		});
		it('should contain .bar', function() {
      var $ = require('../sprint');
      document.body.innerHTML =
        '<div>' +
        '  <div class="foo"></div>' +
        '  <div class="bar"></div>' +
        '</div>';
			var bar = $('.foo').add('.bar').dom[1];
			var bar_node = $('.bar').dom[0];
			expect(bar).toBe(bar_node);
		});
	});

  describe("$('#checkbox').attr('type')", function() {
    it('should return the value of the type attribute', function() {
      document.body.innerHTML =
        '<div>' +
        '  <input id="checkbox" type="checkbox" />' +
        '</div>';
      var $ = require('../sprint');
      var input_type = $('#checkbox').attr('type');
      expect(input_type).toEqual('checkbox');
    });
  });

  describe("$('#checkbox').attr('type', 'text')", function() {
    it('should change the value of the type attribute to "text"', function() {
      document.body.innerHTML =
        '<div>' +
        '  <input id="checkbox" type="checkbox" />' +
        '</div>';
      var $ = require('../sprint');
      var input_type = $('#checkbox').attr('type', 'text').attr('type');
      expect(input_type).toEqual('text');
    });
  });

})();