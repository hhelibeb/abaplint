import * as Statements from "../abap/statements";
import * as Expressions from "../abap/expressions";
import {Registry} from "../registry";
import {Token} from "../abap/tokens/_token";
import {StatementNode, TokenNode} from "../abap/nodes";
import {Identifier} from "../abap/types/_identifier";
import {FormDefinition} from "../abap/types";
import {ABAPFile} from "../files";
import {ABAPObject} from "../objects/_abap_object";
import {SyntaxLogic} from "../abap/syntax/syntax";
import {ITextDocumentPositionParams} from ".";
import {INode} from "../abap/nodes/_inode";
import {Position} from "../position";
import * as LServer from "vscode-languageserver-types";
import {SpaghettiScopeNode} from "../abap/syntax/_spaghetti_scope";

export interface ICursorPosition {
  token: Token;
  identifier: Identifier;
  stack: INode[];
  snode: StatementNode;
}

export class LSPUtils {

  public static tokenToRange(token: Token): LServer.Range {
    return LServer.Range.create(
      token.getStart().getRow() - 1,
      token.getStart().getCol() - 1,
      token.getEnd().getRow() - 1,
      token.getEnd().getCol() - 1);
  }

  public static findCursor(reg: Registry, pos: ITextDocumentPositionParams): ICursorPosition | undefined {
    const file = reg.getABAPFile(pos.textDocument.uri);
    if (file === undefined) {
      return undefined;
    }

    const search = new Position(pos.position.line + 1, pos.position.character + 1);

    for (const statement of file.getStatements()) {
      const res = this.buildStack(statement, search, [statement]);
      if (res !== undefined) {
        return {
          token: res.token,
          identifier: new Identifier(res.token, file.getFilename()),
          stack: res.stack,
          snode: statement};
      }
    }

    return undefined;
  }

  private static buildStack(node: INode, search: Position, parents: INode[]): {token: Token, stack: INode[]} | undefined {
    const stack: INode[] = parents;

    for (const c of node.getChildren()) {
      if (c instanceof TokenNode) {
        const token = c.getFirstToken();
        if (token.getRow() === search.getRow()
            && token.getCol() <= search.getCol()
            && token.getCol() + token.getStr().length > search.getCol()) {
          return {token, stack};
        }
      } else {
        const res = this.buildStack(c, search, stack.concat([c]));
        if (res !== undefined) {
          return res;
        }
      }
    }

    return undefined;
  }

  public static lookup(cursor: ICursorPosition, reg: Registry, obj: ABAPObject):
      ABAPFile | FormDefinition | Identifier | undefined {

    const res = this.findInclude(cursor, reg);
    if (res) {
      return res;
    }

    const scope = new SyntaxLogic(reg, obj).run().spaghetti.lookupPosition(
      cursor.identifier.getStart(), cursor.identifier.getFilename());
    if (scope === undefined) {
      return undefined;
    }

    const form = this.findForm(cursor, scope);
    if (form) {
      return form;
    }

    return scope.findVariable(cursor.token.getStr());
  }

  public static findForm(found: ICursorPosition, scope: SpaghettiScopeNode): FormDefinition | undefined {
    if (!(found.snode.get() instanceof Statements.Perform)) {
      return undefined;
    }

    const name = found.snode.findFirstExpression(Expressions.FormName);
    if (name === undefined) {
      return undefined;
    }

// check the cursor is at the right token
    const token = name.getFirstToken();
    if (token.getStart().getCol() !== found.token.getStart().getCol()
        || token.getStart().getRow() !== found.token.getStart().getRow()) {
      return undefined;
    }

    const resolved = scope.findFormDefinition(found.token.getStr());
    if (resolved) {
      return resolved;
    }

    return undefined;
  }

  public static findInclude(found: ICursorPosition, reg: Registry): ABAPFile | undefined {
    if (!(found.snode.get() instanceof Statements.Include)) {
      return;
    }

    const name = found.snode.findFirstExpression(Expressions.IncludeName);
    if (name === undefined) {
      return undefined;
    }

// check the cursor is at the right token
    const token = name.getFirstToken();
    if (token.getStart().getCol() !== found.token.getStart().getCol()
        || token.getStart().getRow() !== found.token.getStart().getRow()) {
      return undefined;
    }

    const obj = reg.getObject("PROG", token.getStr()) as ABAPObject | undefined;
    if (obj) {
      return obj.getABAPFiles()[0];
    }

    return undefined;
  }

}