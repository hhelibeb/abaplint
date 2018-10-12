import {Statement} from "./statement";
import {str, IRunnable} from "../combi";

export class Else extends Statement {

  public getMatcher(): IRunnable {
    return str("ELSE");
  }

}