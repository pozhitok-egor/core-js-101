/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  data: ['element', 'id', 'class', 'atrr', 'pseudoClass', 'pseudoElement'],
  result: '',

  error(value) {
    if (this.data.indexOf(this.elem) > this.data.indexOf(value)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (value === this.elem && ['element', 'id', 'pseudoElement'].includes(value)) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  },

  element(value) {
    this.error('element');
    const obj = { ...cssSelectorBuilder };
    obj.result = this.result + value;
    obj.elem = 'element';
    return obj;
  },

  id(value) {
    this.error('id');
    const obj = { ...cssSelectorBuilder };
    obj.result = `${this.result}#${value}`;
    obj.elem = 'id';
    return obj;
  },

  class(value) {
    this.error('class');
    const obj = { ...cssSelectorBuilder };
    obj.result = `${this.result}.${value}`;
    obj.elem = 'class';
    return obj;
  },

  attr(value) {
    this.error('atrr');
    const obj = { ...cssSelectorBuilder };
    obj.result = `${this.result}[${value}]`;
    obj.elem = 'atrr';
    return obj;
  },

  pseudoClass(value) {
    this.error('pseudoClass');
    const obj = { ...cssSelectorBuilder };
    obj.result = `${this.result}:${value}`;
    obj.elem = 'pseudoClass';
    return obj;
  },

  pseudoElement(value) {
    this.error('pseudoElement');
    const obj = { ...cssSelectorBuilder };
    obj.result = `${this.result}::${value}`;
    obj.elem = 'pseudoElement';
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = { ...cssSelectorBuilder };
    obj.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return obj;
  },

  stringify() {
    return this.result;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
