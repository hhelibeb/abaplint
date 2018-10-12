import {regex as reg, Expression, IRunnable} from "../combi";

export class Modif extends Expression {
  public getRunnable(): IRunnable {
    return reg(/^\w{1,3}$/);
  }
}