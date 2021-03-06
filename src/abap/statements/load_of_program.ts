import {Statement} from "./_statement";
import {verNot, str, IStatementRunnable} from "../combi";
import {Version} from "../../version";

export class LoadOfProgram extends Statement {

  public getMatcher(): IStatementRunnable {
    const ret = str("LOAD-OF-PROGRAM");

    return verNot(Version.Cloud, ret);
  }

}