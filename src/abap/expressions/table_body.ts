import {seq, tok, Expression, IStatementRunnable} from "../combi";
import {BracketLeft, BracketRightW} from "../tokens/";

export class TableBody extends Expression {
  public getRunnable(): IStatementRunnable {
    const ret = seq(tok(BracketLeft), tok(BracketRightW));
    return ret;
  }
}