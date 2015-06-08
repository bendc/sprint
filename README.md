# Sprint.js

**This is a fork of Benjamin De Cock's original repository. Our goal is to push the development of Sprint further and merge back sometime in the future.**

Sprint is a high-performance, 5KB (gzipped) DOM library for modern browsers. Sprint notably shines on bandwidth and resource constrained devices such as phones and tablets.

Sprint has a familiar, jQuery-like chainable API:

```javascript
$("div").addClass("new").append("<p>Hi Sprint</p>");
```

## Installation

Download the [minified version](https://raw.githubusercontent.com/philplckthun/sprint/master/sprint.min.js) and include it in your page.

```html
<script src="sprint.min.js"></script>
```

Alternatively you can install Sprint via npm and import it, for example to use it with your existing build system.

```
npm install sprint-js
```

## Philosophy

Sprint is an alternative—not a replacement—for jQuery. jQuery offers more features, handles more edge cases and supports more browsers. Sprint is just a thin layer making the DOM friendlier without sacrificing on performance.

## Performance

Sprint relies on newer APIs supported by modern browsers (read: IE10+) and  optimizes a bunch of other things in order to provide you with fast DOM operations.

Here are a few performance tests of some popular methods (Chrome 42, OS X 10.10.3) :

### .add()

![jsperf results](http://sprintjs.com/perf-tests/add.png)

[→ View on jsperf](http://jsperf.com/sprint-js-add)

### .attr()

![jsperf results](http://sprintjs.com/perf-tests/attr.png)

[→ View on jsperf](http://jsperf.com/sprint-js-attr)

### .css()

![jsperf results](http://sprintjs.com/perf-tests/css.png)

[→ View on jsperf](http://jsperf.com/sprintjs-css)

### .has()

![jsperf results](http://sprintjs.com/perf-tests/has.png)

[→ View on jsperf](http://jsperf.com/sprint-js-has)

### .map()

![jsperf results](http://sprintjs.com/perf-tests/map.png)

[→ View on jsperf](http://jsperf.com/sprint-js-map)

### .next()

![jsperf results](http://sprintjs.com/perf-tests/next.png)

[→ View on jsperf](http://jsperf.com/sprint-js-next)

### .not()

![jsperf results](http://sprintjs.com/perf-tests/not.png)

[→ View on jsperf](http://jsperf.com/sprint-js-not)

### .parents()

![jsperf results](http://sprintjs.com/perf-tests/parents.png)

[→ View on jsperf](http://jsperf.com/sprint-js-parents)

### .position()

![jsperf results](http://sprintjs.com/perf-tests/position.png)

[→ View on jsperf](http://jsperf.com/sprint-js-position)

### .slice()

![jsperf results](http://sprintjs.com/perf-tests/slice.png)

[→ View on jsperf](http://jsperf.com/sprint-js-slice)

### .text()

![jsperf results](http://sprintjs.com/perf-tests/text.png)

[→ View on jsperf](http://jsperf.com/sprint-js-text)

Thanks to its reduced feature set, Sprint is also a lot faster to parse and execute (about 40 times faster than jQuery).

## API

The methods supported by Sprint are, for the most part, identical to jQuery's. The few small differences with jQuery are explained below. If nothing is mentioned, you can assume jQuery's documentation applies.

* [add](http://api.jquery.com/add/)
* [addClass](http://api.jquery.com/addClass/)
* [after](http://api.jquery.com/after/)
* [append](http://api.jquery.com/append/)
* [appendTo](http://api.jquery.com/appendTo/)
* [attr](http://api.jquery.com/attr/)
* [before](http://api.jquery.com/before/)
* [children](http://api.jquery.com/children/)
* [clone](http://api.jquery.com/clone/)
* [closest](http://api.jquery.com/closest/)
* [css](http://api.jquery.com/css/)
* [detach](http://api.jquery.com/detach/)
* [each](http://api.jquery.com/each/)
* [empty](http://api.jquery.com/empty/)
* [eq](http://api.jquery.com/eq/)
* [filter](http://api.jquery.com/filter/)
* [find](http://api.jquery.com/find/)
* [first](http://api.jquery.com/first/)
* [get](http://api.jquery.com/get/)
* [has](http://api.jquery.com/has/)
* [hasClass](http://api.jquery.com/hasClass/)
* [height](http://api.jquery.com/height/)
* [html](http://api.jquery.com/html/)
* [index](http://api.jquery.com/index/)
* [insertAfter](http://api.jquery.com/insertAfter/)
* [insertBefore](http://api.jquery.com/insertBefore/)
* [is](http://api.jquery.com/is/)
* [last](http://api.jquery.com/last/)
* [map](http://api.jquery.com/map/)
* [next](http://api.jquery.com/next/)
* [nextAll](http://api.jquery.com/nextAll/)
* [nextUntil](http://api.jquery.com/nextUntil/)
* [not](http://api.jquery.com/not/)
* [off](http://api.jquery.com/off/) - _no support for selector_
* [offset](http://api.jquery.com/offset/)
* [offsetParent](http://api.jquery.com/offsetParent/)
* [on](http://api.jquery.com/on/) - _no support for selector and data_
* [parent](http://api.jquery.com/parent/)
* [parents](http://api.jquery.com/parents/)
* [position](http://api.jquery.com/position/)
* [prop](http://api.jquery.com/prop/)
* [prepend](http://api.jquery.com/prepend/)
* [prependTo](http://api.jquery.com/prependTo/)
* [prev](http://api.jquery.com/prev/)
* [prevAll](http://api.jquery.com/prevAll/)
* [prevUntil](http://api.jquery.com/prevUntil/)
* [ready](http://api.jquery.com/ready/)
* [remove](http://api.jquery.com/remove/)
* [removeAttr](http://api.jquery.com/removeAttr/)
* [removeClass](http://api.jquery.com/removeClass/)
* [removeProp](http://api.jquery.com/removeProp/)
* [replaceAll](http://api.jquery.com/replaceAll/)
* [replaceWith](http://api.jquery.com/replaceWith/)
* [scrollLeft](http://api.jquery.com/scrollLeft/)
* [scrollTop](http://api.jquery.com/scrollTop/)
* [siblings](http://api.jquery.com/siblings/)
* [size](http://api.jquery.com/size/)
* [slice](http://api.jquery.com/slice/)
* [text](http://api.jquery.com/text/)
* [toggleClass](http://api.jquery.com/toggleClass/) - _no support for .toggleClass([switch])_
* [trigger](http://api.jquery.com/trigger/) - _no support for Event object and extraParameters_
* [unwrap](http://api.jquery.com/unwrap/)
* [val](http://api.jquery.com/val/)
* [width](http://api.jquery.com/width/)
* [wrap](http://api.jquery.com/wrap/)
* [wrapAll](http://api.jquery.com/wrapAll/)
* [wrapInner](http://api.jquery.com/wrapInner/)
