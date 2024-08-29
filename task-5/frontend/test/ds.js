/**
 * @typedef {Object.<string, string>} Dictionary
 * @typedef {Dictionary[]} ListOfDicts
 */

export class CustomDictionary {
  constructor() {
    /**
     * Initialize a Map to hold the data
     * @type {Map}
     */
    this.data = new Map();

    CustomDictionary.instance = this;
  }

  /**
   * Method to add an entry
   * @param {String} key
   * @param {ListOfDicts} listOfDicts
   * @returns {void}
   */
  add(key, listOfDicts) {
    if (!Array.isArray(listOfDicts)) {
      throw new Error("Value must be an array of dictionaries.");
    }
    for (const item of listOfDicts) {
      if (typeof item !== "object" || item === null) {
        throw new Error(
          "Each item in the array must be a dictionary (object)."
        );
      }
    }
    this.data.set(key, listOfDicts);
  }

  /**
   * Method to get an entry by key
   * @param {String} key
   * @returns {ListOfDicts}
   */
  get(key) {
    return this.data.get(key);
  }

  /**
   * Returns the whole data
   * @returns {Map}
   */
  getAll() {
    return this.data;
  }

  /**
   * Method to remove an entry by key
   * @param {String} key
   * @returns {void}
   */
  remove(key) {
    this.data.delete(key);
  }

  /**
   * Method to remove an entry by key
   * @returns {Array}
   */
  keys() {
    return Array.from(this.data.keys());
  }

  /**
   * Method to get all entries
   * @returns {Array}
   */
  entries() {
    return Array.from(this.data.entries());
  }

  static getInstance() {
    if (!CustomDictionary.instance) {
      CustomDictionary.instance = new CustomDictionary();
    }
    return CustomDictionary.instance;
  }
}

// Example usage:

// Create an instance of the class
// const customDict = new CustomDictionary();

// // Add some entries
// customDict.add("key1", [
//     { "subKey1": "value1" },
//     { "subKey2": "value2" }
// ]);

// customDict.add("key2", [
//     { "subKeyA": "valueA" },
//     { "subKeyB": "valueB" }
// ]);

// // Get an entry by key
// console.log(customDict.get("key1"));

// // Remove an entry by key
// customDict.remove("key2");

// // Get all keys
// console.log(customDict.keys());

// // Get all entries
// console.log(customDict.entries());
// // has context menu
