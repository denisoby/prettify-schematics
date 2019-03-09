import {
  Action,
  Rule,
  SchematicContext,
  Tree
} from "@angular-devkit/schematics";

import * as fs from "fs";
// import * as path from "path";
import * as cosmiconfig from "cosmiconfig";
import { Hunk, structuredPatch } from "diff";

interface ChangedFileAndLines {
  path: string;
  lines?: {
    rangeStart: number; // 0 based
    rangeEnd: number;
  };
}

// todo get project root from project property or somewhehe else?
const projectRoot = process.cwd();

// todo deniso Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function(options: any): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    options;

    const actions = _tree.actions;
    const actionsDiffsHunks = getActionsDiff(actions);

    if (actionsDiffsHunks) {
      let prettierConfig: any;
      prettierConfig = prettierConfig || getPrettierConfig(projectRoot);

    }

    let actionsForLogging = actions.map((action: Action) => ({
      ...action,
      content: "--content--"
    }));

    context.logger.info(
      "My Full Schematic: " + JSON.stringify(actionsForLogging, null, 4)
    );
  };
}

function getActionsDiff(actions: Action[]) {
  let allChanges: ChangedFileAndLines[] = [];

  actions.forEach((action: Action) => {
    if (!(action as any).content) {
      return;
    }

    const path = action.path;

    if (action.kind === "c") {
      // file is created and all lines are changed
      allChanges.push({
        path
      });
      return;
    }

    const fileChanges = getFileDiff(action, path);

    allChanges = [...allChanges, ...fileChanges];
  });

}

function getFileDiff(action: Action, path: string) {

  const actionChanges: ChangedFileAndLines[] = [];
  // let's create diff and compare to find changes

  const newContent = (action as any).content.toString();
  const fullPath = projectRoot + path;

  console.log("fullPath: ", fullPath);
  const oldContent = fs.readFileSync(fullPath, {encoding: "utf-8"});

  console.log("oldContent: ", oldContent);

  const diff = structuredPatch(
      "oldFileNameUseless",
      "newFileNameUseless",
      newContent,
      oldContent,
      "oldHeaderUseless",
      "newHeaderUseless",
      {
        newlineIsToken: true
      }
  );

  // const FgRed = "\x1b[31m";
  // const FgGreen = "\x1b[32m";
  // const FgWhite = "\x1b[37m";

  diff.hunks.forEach((part: Hunk) => {
    // green for additions, red for deletions
    // grey for common parts
    console.log("---------- next hunk");
    console.log(JSON.stringify(part, null, 4));

    actionChanges.push({
      path,
      lines: {
        rangeStart: part.newStart,
        rangeEnd: part.newStart + part.newLines - 1
      }
    });
  });

  return actionChanges;
}

function getPrettierConfig(projectRoot: string) {
  const explorer = cosmiconfig("prettier");
  const prettierConfig = explorer.searchSync(projectRoot);
  return prettierConfig;
}

function format(changes: ChangedFileAndLines) {
// todo handle empty config ?
// todo load config directly by addr from params

    todo make run next line

// const formattedSource = prettier.format(newContent, {...prettierConfig, rangeStart: )



}
