import {seq, opt, tok, star, regex as reg, Expression, IRunnable} from "../combi";
import {Dash} from "../tokens/";

export class FormName extends Expression {
  public getRunnable(): IRunnable {
    return seq(reg(/^[\w%\/][\w\*\/]*$/), star(seq(tok(Dash), opt(reg(/^\w+$/)))));
  }
}