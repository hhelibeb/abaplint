import { Check } from "./check";
import File from "../file";
import Report from "../report";
import Issue from "../issue";
import Position from "../position";
import * as Statements from "../statements/statements";

export class Check09 implements Check {

    constructor(private report: Report) { }

    public get_key(): string {
        return "09";
    }

    public get_description(): string {
        return "Parser error(Unknown statement)";
    }

    public run(file: File) {
        let pos = new Position(0, 0);
        for (let statement of file.get_statements()) {
            if (statement instanceof Statements.Unknown
                    && pos.get_row() !== statement.get_tokens()[0].get_pos().get_row()) {
                pos = statement.get_tokens()[0].get_pos();
                let issue = new Issue(this, pos, file);
                this.report.add(issue);
            }
        }
    }

}