import {structureType} from "../_utils";
import {ClassDefinition} from "../../../src/abap/structures";

const cases = [
  {abap: "CLASS zfoo DEFINITION. ENDCLASS."},
  {abap: "CLASS zfoo DEFINITION. PUBLIC SECTION. CONSTANTS foo TYPE i VALUE 2. ENDCLASS."},
  {abap: "CLASS zfoo DEFINITION. PRIVATE SECTION. CONSTANTS foo TYPE i VALUE 2. ENDCLASS."},
  {abap: "CLASS zfoo DEFINITION. PROTECTED SECTION. CONSTANTS foo TYPE i VALUE 2. ENDCLASS."},
];

structureType(cases, new ClassDefinition());