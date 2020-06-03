import Controller from "../lib/controller.js";
// Importing node functions
import * as path from "path";
import * as fs from 'fs';
const {readFile} = fs.promises;

let staticPaths;

// This will be a server only route;
export default class StaticController extends Controller {

  static get route() {
    return ''; // Match everything.
  }

  constructor(paths) {
    super();

    staticPaths = [...paths].push('./')
  }

  /*
    url: URL
  */
  async render(url) {
    // Need to work out how to resolve the path correctly and MIME types.
    const { pathname } = url;


    // Fall through the list of paths.
    for (let currentPath of staticPaths) {
      // Don't allow the path out of the root.
      const hostedFile = path.join(currentPath, pathname);
    
      try {
        return readFile(hostedFile, "utf8");
      } catch (err) {
        return;
      }
   }
  }
}