import {Statement} from "./statement";
import {str, IRunnable} from "../combi";

export class Continue extends Statement {

  public getMatcher(): IRunnable {
    return str("CONTINUE");
  }

}