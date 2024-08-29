import { CustomDictionary } from "./ds.js";

export class ApiCalls {
  constructor() {
    /**
     * @type {CustomDictionary}
     */
    this.customDict = CustomDictionary.getInstance();
    this.multipleUpdate();
  }

  multipleUpdate() {
    console.log(this.customDict.getAll());
  }
}
