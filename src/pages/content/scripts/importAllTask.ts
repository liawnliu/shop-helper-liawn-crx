
import { ModulesType } from '../index';
import path from 'path-browserify';


const importAllTask = (modules: ModulesType) => {
  const files = require.context("../tasks", false, /\.ts$/);

  files.keys().forEach((key) => {
    const name = path.basename(key, ".ts") as TaskKeys;
    modules[name] = files(key).default || files(key);
  });
}
export default importAllTask;
