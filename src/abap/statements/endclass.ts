import {Statement} from "./statement";
import {str, IRunnable} from "../combi";

export class EndClass extends Statement {

  public getMatcher(): IRunnable {
    return str("ENDCLASS");
  }

}