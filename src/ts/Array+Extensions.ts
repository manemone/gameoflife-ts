export {};

declare global {
  interface Array<T> {
    /**
     * Return the elment at given index. The index will be regareded as in "circular" form.
     * ```ts
     * > const fruits = ['Apple', 'Banana', 'Cucumber', 'Date'];
     * > fruits.circularAt(-1); // => 'Date'
     * > fruits.circularAt(4); // => 'Apple'
     * > fruits.circularAt(9); // => 'Banana'
     * ```
     * @param {number} i Index number of element regarded as in "circular" form.
     */
    circularAt(i: number): T | undefined;
  }
}

Array.prototype.circularAt = function(i: number) {
  if (this.length == 0) { return undefined; }

  if (i < 0) {
    return this[this.length + (i % this.length)];
  }
  else {
    return this[i % this.length];
  }
};