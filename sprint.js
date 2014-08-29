/*
 * Sprint JavaScript Library v1.0.0
 * http://sprintjs.com
 */

var Sprint;

(function() {
  "use strict"

  var d = document
  var matchSelector;

  ["m", "webkitM", "msM", "mozM"].forEach(function(prefix) {
    var name = prefix + "atchesSelector"
    if (!matchSelector && Element.prototype[name]) {
      matchSelector = name
    }
  })

  function selectElements(selector) {
    if (selector == "body") {
      return [d.body]
    }
    // "#id", ".class" or "tagName"
    else if (/^[\#.]?[\w-]+$/.test(selector)) {
      switch (selector[0]) {
        case "#":
          return [d.getElementById(selector.slice(1))]
        case ".":
          return d.getElementsByClassName(selector.slice(1))
        default:
          return d.getElementsByTagName(selector)
      }
    }
    return d.querySelectorAll(selector)
  }

  function Init(selector) {
    switch (typeof selector) {
      case "string":
        if (selector[0] == "<") {
          var tmp = d.createElement("div")
          tmp.innerHTML = selector.trim()
          this.dom = [tmp.firstChild]
        }
        else {
          this.dom = selectElements(selector)
        }
        this.length = this.dom.length
        break
      case "function":
        this.dom = [d]
        this.length = 1
        this.on("DOMContentLoaded", selector) 
        break
      default:
        var selectorLength = selector.length
        if (selectorLength === 0) {
          this.dom = selector
          this.length = selectorLength
        }
        else {
          this.dom = selectorLength ? selector : [selector]
          this.length = selectorLength || 1
        }
    }
  }

  Init.prototype = {
    addClass: function(name) {
      this.updateClass("add", name)
      return this
    },
    append: function(content) {
      if (typeof content == "string") {
        if (content[0] == "<") {
          this.each(function() {
            this.insertAdjacentHTML("beforeend", content)
          })
        }
      }
      else {
        if (content instanceof Init) {
          content = content.get()
        }
        else if (!content.length) {
          content = [content]
        }
        this.each(function() {
          for (var i=0, l=content.length; i<l; i++) {
            this.insertAdjacentHTML("beforeend", content[i].outerHTML)
          }
        })
      }
      return this
    },
    appendTo: function(selector) {
      var dom = []
      var node = this.get(0)
      var parentNodes = selectElements(selector)

      for (var i=0, l=parentNodes.length; i<l; i++) {
        var cloned = node.cloneNode(true)
        dom.push(cloned)
        parentNodes[i].appendChild(cloned)
      }

      this.dom = dom
      this.length = dom.length
      return this
    },
    attr: function(name, value) {
      if (value === undefined) {
        var attributes = []
        this.each(function() {
          attributes.push(this.getAttribute(name))
        })
        return attributes.length == 1 ? attributes[0] : attributes
      }
      else {
        this.each(function() {
          this.setAttribute(name, value)
        })
        return this
      }
    },
    before: function() {
      
    },
    children: function(selector) {
      var dom = []
      if (selector) {
        var self = this
        this.each(function() {
          var nodes = this.childNodes
          for (var i=0, l=nodes.length; i<l; i++) {
            var node = nodes[i]
            if (node.nodeType == 1 && self.is(selector, node)) {
              dom.push(node)
            }
          }
        })
      }
      else
        this.each(function() {
          var nodes = this.childNodes
          for (var i=0, l=nodes.length; i<l; i++) {
            var node = nodes[i]
            node.nodeType == 1 && dom.push(node)
          }
        })
      return Sprint(dom)
    },
    closest: function(selector) {
      var dom = []
      var self = this
      this.each(function() {
        var prt = this.parentNode
        var root = d.documentElement
        while (prt != root) {
          if (self.is(selector, prt)) {
            dom.push(prt)
            break
          }
          else {
            prt = prt.parentNode
          }
        }
      })
      return Sprint(dom)
    },
    each: function(callback) {
      // callback(index, element) where element == this
      for (var i=0; i<this.length; i++) {
        var node = this.get(i)
        callback.call(node, i, node) 
      }
      return this
    },
    empty: function() {
      this.each(function() {
        this.innerHTML = ""
      })
      return this
    },
    eq: function(index) {
      var dom = index < this.length ? [this.get(index)] : []
      return Sprint(dom)
    },
    filter: function(selector) {
      var dom = []
      var self = this
      this.each(function() {
        if (self.is(selector, this)) {
          dom.push(this)
        }
      })
      return Sprint(dom)
    },
    find: function(selector) {
      var dom = []
      this.each(function() {
        var nodes = this.querySelectorAll(selector)
        for (var i=0, l=nodes.length; i<l; i++) {
          dom.push(nodes.item(i))
        }
      })
      return Sprint(dom)
    },
    get: function(index) {
      return index === undefined ? this.dom : this.dom[index]
    },
    hasClass: function(name) {
      var classFound = false
      this.each(function() {
        if (!classFound && this.classList.contains(name)) {
          classFound = true
        }
      })
      return classFound
    },
    is: function(selector, element) {
      var el = element || this.get(0)
      return el[matchSelector](selector)
    },
    next: function(selector) {
      var dom = []
      if (selector === undefined) {
        this.each(function() {
          dom.push(this.nextElementSibling)
        })
      }
      else {
        var self = this
        this.each(function() {
          var next = this.nextElementSibling
          self.is(selector, next) && dom.push(next)
        })
      }
      return Sprint(dom)
    },
    off: function(type, callback) {
      switch (arguments.length) {
        case 0:
          this.each(function(i, el) {
            if (!this.sprintEventListeners) return
            Object.keys(this.sprintEventListeners).forEach(function(key) {
              el.sprintEventListeners[key].forEach(function(callbackReference) {
                el.removeEventListener(key, callbackReference) 
              })
            }) 
          })
          this.sprintEventListeners = {}
          break
        case 1:
          this.each(function(i, el) {
            if (!this.sprintEventListeners) return
            this.sprintEventListeners[type].forEach(function(callbackReference) {
              el.removeEventListener(type, callbackReference) 
            }) 
            delete this.sprintEventListeners[type]
          })
          break
        case 2:
          this.each(function() {
            if (!this.sprintEventListeners) return
            var updatedSprintEventListeners = []
            this.sprintEventListeners[type].forEach(function(callbackReference) {
              callback != callbackReference && updatedSprintEventListeners.push(callbackReference)
            }) 
            this.removeEventListener(type, callback) 
            this.sprintEventListeners[type] = updatedSprintEventListeners
          })
          break
      }
      return this
    },
    on: function(type, callback) {
      this.each(function() {
        var callbackReference = callback
        this.sprintEventListeners || (this.sprintEventListeners = {})
        this.sprintEventListeners[type] || (this.sprintEventListeners[type] = [])
        this.sprintEventListeners[type].push(callbackReference)
        this.addEventListener(type, callbackReference)
      })
      return this
    },
    parent: function(selector) {
      var dom = []
      if (selector) {
        var self = this
        this.each(function() {
          var prt = this.parentNode
          if (self.is(selector, prt)) {
            dom.push(prt)
          }
        })
      }
      else {
        this.each(function() {
          dom.push(this.parentNode)
        })
      }
      return Sprint(dom)
    },
    removeAttr: function(name) {
      this.each(function() {
        this.removeAttribute(name)
      })
      return this
    },
    removeClass: function(name) {
      name === undefined
        ? this.removeAttr("class")
        : this.updateClass("remove", name)
      return this
    },
    size: function() {
      return this.get().length
    },
    text: function(content) {
      if (content === undefined) {
        var texts = []
        this.each(function() {
          texts.push(this.textContent)
        })
        return texts.length == 1 ? texts[0] : texts
      }
      else {
        this.each(function() {
          this.textContent = content
        })
        return this
      }
    },
    toggleClass: function(name) {
      this.updateClass("toggle", name)
      return this
    },
    wrap: function(element) {
      // single element
      if (element.match(/</g).length < 3) {
        /*var div = document.createElement("div")
        var p = document.querySelector("p")
        var parent = p.parentNode
        var next = p.nextSibling
        div.appendChild(p)
        parent.insertBefore(div, next)*/
      }
      // nested elements
      else {
        // use my this.children method to find the most inner element
        // use my before() and next() methods
      }
    },

    // undocumented, mostly for internal use
    updateClass: function(method, name) {
      this.each(function() {
        this.classList[method](name)
      })
    }
  }

  // public

  Sprint = function(selector) {
    return new Init(selector)
  }

  window.$ === undefined && (window.$ = Sprint)
})();
