
/**
 * Stack for holding stuff. 
 * Based on code from my cmd.js
 *
 * @author   Jake Gully, chimpytk@gmail.com
 * @license  MIT License
 */

/**
 * Constructor
 * @param {integer} max_size Number of commands to store
 */
var Stack = function(max_size) {
  "use strict";

  var arr = []; // This is a fairly meaningless name but
                // makes it sound like this function was
                // written by a pirate.  I'm keeping it.

  if (typeof max_size !== 'number') {
    throw 'Stack error: max_size should be a number.';
  }

  /**
   * Push an item to the array
   * @param  {string} item Item to append to stack
   */
  function push(item) {
    arr.push(item);

    // crop off excess
    while (arr.length > max_size) {
      arr.shift();
    }
  }

  /**
   * Get an item by it's index.
   * @return {Integer} 
   */
  function get(index) {
    if (index < 1) {
      var item = arr.slice(index);
      
      return item || false;
    }

    if (typeof arr[index] === 'undefined') {
      return false;
    }
    
    return arr[index];
  }

  /**
   * Return the last item on the stack.
   * @return {Various} Item
   */
  function getLast() {
    if (this.isEmpty()) {
      return false;
    }

    return arr[arr.length - 1];
  }
  
  /**
   * Is stack empty
   * @return {Boolean} True if stack is empty
   */
  function isEmpty() {
    return (arr.length === 0);
  }

  /**
   * Empty array and remove from localstorage
   */
  function empty() {
    arr = undefined;
    reset();
  }

  /**
   * Get entire stack array
   * @return {array} The stack array
   */
  function getArr() {
    return arr;
  }

  /**
   * Get size of the stack
   * @return {Integer} Size of stack
   */
  function getSize(){
    return arr.size;
  }

  return {
    push: push,
    isEmpty: isEmpty,
    empty: empty,
    getArr: getArr,
    getSize: getSize,
    get: get,
    getLast: getLast
  };
};

module.exports = Stack;
