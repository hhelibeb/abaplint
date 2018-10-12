import {str, seq, Expression, IRunnable} from "../combi";
import {Field, Source} from "./";

export class ParameterS extends Expression {
  public getRunnable(): IRunnable {
    return seq(new Field(), str("="), new Source());
  }
}