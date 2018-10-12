import {Statement} from "./statement";
import {str, IRunnable} from "../combi";

export class EndDo extends Statement {

  public getMatcher(): IRunnable {
    return str("ENDDO");
  }

}