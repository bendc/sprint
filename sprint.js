var Sprint;

(function() {
  "use strict"

  var d = document
  var matchSelector = (function() {
    var prefixes = ["m", "webkitM", "msM", "mozM"]
    var i = -1
    var l = prefixes.length
    while (++i < l) {
      var name = prefixes[i] + "atchesSelector"
      if (Element.prototype[name]) {
        return name
      }
    }
  })()

  function toArray(obj) {
    // Converts array-like objects to actual arrays.
    // If obj is a Sprint object, the DOM reference gets updated.

    if (obj instanceof Array) return obj
    var isSprintObj = obj instanceof Init
    var dom = [].map.call(isSprintObj ? obj.get() : obj, function(el) {
      return el
    })
    if (isSprintObj) obj.dom = dom
    return dom
  }

  function selectByTag(tagName) {
    switch (tagName) {
      case "body":
        return [d.body]
      case d:
        return [d]
      default:
        return d.getElementsByTagName(tagName)
    }
  }

  function selectElements(selector) {
    // .class, #id or tagName
    if (/^[\#.]?[\w-]+$/.test(selector)) {
      switch (selector[0]) {
        case ".":
          return d.getElementsByClassName(selector.slice(1))
        case "#":
          return [d.getElementById(selector.slice(1))]
        default:
          return selectByTag(selector)
      }
    }
    return d.querySelectorAll(selector)
  }

  function findDescendants(parent) {
    return parent.getElementsByTagName("*") 
  }

  function addEventListeners(listeners, el) {
    var sprintClone = Sprint(el)
    Object.keys(listeners).forEach(function(key) {
      listeners[key].forEach(function(callback) {
        sprintClone.on(key, callback)
      })
    })
  }

  function duplicateEventListeners(el, clone) {
    // duplicate event listeners for the parent element
    var listeners = el.sprintEventListeners 
    listeners && addEventListeners(listeners, clone)

    // and its children
    var elChildren = findDescendants(el)
    // cloneChildren is defined later to avoid calling findDescendants if not needed
    var cloneChildren 
    var i = -1
    var l = elChildren.length

    while (++i < l) {
      var listeners = elChildren[i].sprintEventListeners
      if (listeners) {
        if (!cloneChildren) {
          cloneChildren = findDescendants(clone)
        }
        addEventListeners(listeners, cloneChildren[i])
      }
    }
  }

  function insertHTML(position, content) {
    if (typeof content == "string") {
      this.each(function() {
        this.insertAdjacentHTML(position, content)
      })
    }
    else {
      // DOM node: single existing DOM node, createTextNode() or createElement()
      // Or collection: $("div"), [element1, element2], document.getElementsByTagName, etc.

      var elementsToInsert = content.nodeType ? [content] : toArray(content)
      var clonedElements = []
      var methods = {
        beforeend: function(clone) {
          this.appendChild(clone) 
        },
        beforebegin: function(clone) {
          this.parentNode.insertBefore(clone, this) 
        }
      }

      this.each(function(index) {
        var self = this
        elementsToInsert.forEach(function(el) {
          var clone = el.cloneNode(true)
          methods[position].call(self, clone)
          duplicateEventListeners(el, clone)
          clonedElements.push(clone)

          if (index > 0) return
          var prt = el.parentNode
          if (prt) prt.removeChild(el)
        })
      })

      if (content instanceof Init) content.dom = clonedElements
      return clonedElements
    }
  }

  function setStyle(el, prop, value) {
    el.style[prop] = value ? value : "none"
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
      insertHTML.call(this, "beforeend", content)
      return this
    },
    appendTo: function(selector) {
      if (!(selector instanceof Init)) {
        selector = Sprint(selector)
      }
      return Sprint(insertHTML.call(selector, "beforeend", this))
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
    before: function(content) { 
      insertHTML.call(this, "beforebegin", content)
      return this
    },
    children: function(selector) {
      var dom = []
      var self = this
      this.each(function() {
        var nodes = this.children
        var i = -1
        var l = nodes.length

        while (++i < l) {
          var node = nodes[i]
          if (!selector || self.is(selector, node)) {
            dom.push(node)
          }
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
    css: function(property, value) {
      if (value != undefined) {
        // set
        if (typeof value == "string") {
          this.each(function() {
            setStyle(this, property, value)
          })
        }
        // set
        else if (typeof value == "function") {
          this.each(function(index, element) {
            setStyle(this, property, value(index, element))
          })
        }
        return this
      }
      else {
        // read
        if (typeof property == "string") {
          return getComputedStyle(this.get(0)).getPropertyValue(property)
        }
        // read
        else if (Array.isArray(property)) {
          var o = {}
          var styles = getComputedStyle(this.get(0))
          property.forEach(function(prop) {
            o[prop] = styles.getPropertyValue(prop) 
          })
          return o
        }
        // set (property is an object)
        else {
          var properties = Object.keys(property)
          this.each(function() {
            var self = this
            properties.forEach(function(prop) {
              setStyle(self, prop, property[prop])
            })
          })
          return this
        }
      }
    },
    each: function(callback) {
      // callback(index, element) where element == this
      var i = -1
      var l = this.length

      while (++i < l) {
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
      switch (typeof selector) {
        case "string":
          var self = this
          this.each(function() {
            self.is(selector, this) && dom.push(this)
          })
          break
        case "function":
          this.each(function(index, el) {
            selector.call(this, index, el) && dom.push(this)
          })
          break
        default:
          return this
      }
      return Sprint(dom)
    },
    find: function(selector) {
      var dom = []
      this.each(function() {
        var nodes = this.querySelectorAll(selector)
        var i = -1
        var l = nodes.length
        while (++i < l) {
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
    index: function(el) {
      var toFind
      var sprintElements
      if (!el) {
        toFind = this.eq(0).get(0)
        sprintElements = this.eq(0).parent().children()
      }
      else if (typeof el == "string") {
        toFind = this.get(0)
        sprintElements = Sprint(el)
      }
      else {
        toFind = el instanceof Init ? el.get(0) : el
        sprintElements = this
      }
      var elements = sprintElements.get()
      var i = -1
      var l = elements.length
      while (++i < l) {
        if (elements[i] === toFind) return i
      }
      return -1
    },
    is: function(selector, element) {
      var el = element || this.get(0)
      return el[matchSelector](selector)
    },
    next: function(selector) {
      var dom = []
      var self = this
      this.each(function() {
        var next = this.nextElementSibling
        if (!selector || self.is(selector, next)) {
          dom.push(next)
        }
      })
      return Sprint(dom)
    },
    off: function(type, callback) {
      switch (arguments.length) {
        // .off()
        case 0:
          this.each(function(i, el) {
            if (!this.sprintEventListeners) return
            Object.keys(this.sprintEventListeners).forEach(function(key) {
              el.sprintEventListeners[key].forEach(function(callbackReference) {
                el.removeEventListener(key, callbackReference) 
              })
            }) 
            this.sprintEventListeners = {}
          })
          break

        // .off("click")
        case 1:
          this.each(function(i, el) {
            if (!this.sprintEventListeners) return
            this.sprintEventListeners[type].forEach(function(callbackReference) {
              el.removeEventListener(type, callbackReference) 
            }) 
            this.sprintEventListeners[type] = []
          })
          break

        // .off("click", handler)
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
        if (!this.sprintEventListeners) {
          this.sprintEventListeners = {}
        }
        if (!this.sprintEventListeners[type]) {
          this.sprintEventListeners[type] = []
        }
        this.sprintEventListeners[type].push(callbackReference)
        this.addEventListener(type, callbackReference)
      })
      return this
    },
    parent: function(selector) {
      var dom = []
      var self = this
      this.each(function() {
        var prt = this.parentNode
        if (!selector || self.is(selector, prt)) {
          dom.push(prt)
        }
      })
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
    siblings: function(selector) {
      var siblings = []
      this.each(function() {
        var self = this
        Sprint(this).parent().children().each(function() {
          if (this == self || (selector && !Sprint(this).is(selector))) return
          siblings.push(this)
        })
      })
      return Sprint(siblings)
    },
    size: function() {
      return this.length
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
      if (typeof element == "function") {
        this.each(function() {
          Sprint(this).wrap(element.call(this))
        })
      }
      else {
        toArray(this)

        var sprintElement = element instanceof Init ? element : Sprint(element)
        var outerWrap = sprintElement.get(0)
        var outerWrapHTML = typeof element == "string" ? element : outerWrap.outerHTML
        var nestedElements = outerWrapHTML.match(/</g).length > 2

        this.each(function() {
          var clone = outerWrap.cloneNode(true)
          var prt = this.parentNode
          var next = this.nextSibling
          var elementPrt

          if (nestedElements) {
            // find most inner child
            var innerWrap = clone.firstChild
            while (innerWrap.firstChild) innerWrap = innerWrap.firstChild
            elementPrt = innerWrap
          }
          else {
            elementPrt = clone
          }

          duplicateEventListeners(outerWrap, clone)
          elementPrt.appendChild(this)
          prt.insertBefore(clone, next)
        })
      }

      return this
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
