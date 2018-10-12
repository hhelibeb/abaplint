import {Statement} from "./statement";
import {str, IRunnable} from "../combi";

export class Return extends Statement {

  public getMatcher(): IRunnable {
    return str("RETURN");
  }

}