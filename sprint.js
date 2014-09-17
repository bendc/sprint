/*
 * Sprint JavaScript Library v1.0.0
 * http://sprintjs.com
 */

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

  function toArray(collection) {
    if (collection instanceof Array) return
    return [].map.call(collection, function(el) {
      return el
    })
  }

  function updateDom(newDom) {
    this.dom = newDom
    this.length = newDom.length
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

  function duplicateEventListeners(el, clone) {
    if (!el.sprintEventListeners) return
    var $clone = Sprint(clone)              
    Object.keys(el.sprintEventListeners).forEach(function(key) {
      el.sprintEventListeners[key].forEach(function(callback) {
        $clone.on(key, callback)
      })
    })
  }

  function insertHTML(position, content) {
    if (typeof content == "string") {
      this.each(function() {
        this.insertAdjacentHTML(position, content)
      })
    }
    else {
      var elementsToInsert = content.nodeType
        // DOM node: single existing DOM node, createTextNode() or createElement()
        ? [content]
        // collection: $("div"), [element1, element2], document.getElementsByTagName, etc.
        : toArray(content instanceof Init ? content.get() : content)

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

      return clonedElements
    }
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
      return Sprint(insertHTML.call(Sprint(selector), "beforeend", this))
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
      if (selector) {
        var self = this
        this.each(function() {
          var nodes = this.childNodes
          var i = -1
          var l = nodes.length

          while (++i < l) {
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
          var i = -1
          var l = nodes.length

          while (++i < l) {
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
      updateDom.call(this, toArray(this.get()))

      var outerWrap = Sprint(element).get(0)
      var nestedElements = typeof element == "string" && element.match(/</g).length > 2

      this.each(function() {
        var clone = outerWrap.cloneNode(true)
        var prt = this.parentNode
        var next = this.nextSibling

        if (nestedElements) {
          // find most inner child
          var innerWrap = clone.firstChild
          while (innerWrap.firstChild) innerWrap = innerWrap.firstChild
          innerWrap.appendChild(this)
        }
        else {
          duplicateEventListeners(outerWrap, clone)
          clone.appendChild(this)
        }

        prt.insertBefore(clone, next)
      })

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
