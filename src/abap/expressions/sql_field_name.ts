import {regex as reg, Expression, IRunnable} from "../combi";

export class SQLFieldName extends Expression {
  public getRunnable(): IRunnable {
    return reg(/^[\w~]+$/);
  }
}