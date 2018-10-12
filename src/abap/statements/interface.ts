import {Statement} from "./statement";
import {str, seq, opt, alt, IRunnable} from "../combi";
import {Field} from "../expressions";

export class Interface extends Statement {

  public getMatcher(): IRunnable {
    let options = alt(str("PUBLIC"), str("LOAD"), str("DEFERRED"));

    return seq(str("INTERFACE"),
               new Field(),
               opt(options));
  }

}