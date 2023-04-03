import { ModulesType } from '../index'
export default class Tasks {
  private _nowRunTask: TaskKeys | undefined;
  private _taskKeys: TaskKeys[] = [];
  private _status: 'RUNNING' | 'STOP' = 'STOP';
  private _scriptModules: ModulesType;
  constructor(scriptModules: ModulesType) {
    this._scriptModules = scriptModules;
  }
  push(item: TaskKeys) {
    this._taskKeys.push(item);
    this.toRun();
  }
  public async toRun(params?: any) {
    if (this._status === 'STOP' && this._taskKeys.length) {
      this._nowRunTask = this._taskKeys.shift();
      if (this._nowRunTask) {
        const func = this._scriptModules[this._nowRunTask];
        if (func) {
          this._status = 'RUNNING'
          await func(params);
          this._status = 'STOP'
        }
      }
    }
  }
}
