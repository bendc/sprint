(function(){
	
  'use strict';

	describe("$('.foo').add('.bar')", function() {
    it('should contain .foo', function() {
      var foo = $('.foo').add('.bar').dom[0];
      var foo_node = $('.foo').dom[0];
      expect(foo).toBe(foo_node);
    });
    it('should contain .bar', function() {
      var bar = $('.foo').add('.bar').dom[1];
      var bar_node = $('.bar').dom[0];
      expect(bar).toBe(bar_node);
    });
  });

  describe("$('#checkbox').attr('type')", function() {
    it('should return the value of the type attribute', function() {
      var input_type = $('#checkbox').attr('type');
      expect(input_type).toEqual('checkbox');
    });
  });

  describe("$('#checkbox').attr('type', 'text')", function() {
    it('should change the value of the type attribute to "text"', function() {
      var input_type = $('#checkbox').attr('type', 'text').attr('type');
      expect(input_type).toEqual('text');
    });
  });

})();