import {
  chain,
  Rule,
  schematic,
  SchematicContext,
  Tree
} from "@angular-devkit/schematics";

const createFile: Rule = (tree: Tree, context: SchematicContext) => {
  context.logger.info("File is created");
  tree.create(
    "hello.ts",
    "class ClassWithOutFormatting{ public x = 1; y = function(){return 2}}"
  );
  return tree;
};

const overwriteFile: Rule = (tree: Tree, context: SchematicContext) => {
  context.logger.info("File is overwritten");
  let path = "src/main.ts";
  const content: Buffer | null = tree.read(path);
  const newContent = content!.toString().replace(
    "enableProdMode();",
    `
    // enableProdMode here
    enableProdMode();
  `
  );
  debugger;
  tree.overwrite(path, newContent);
  return tree;
};

const modifyFile: Rule = (tree: Tree, context: SchematicContext) => {
  context.logger.info("File is modified");
  let path = "src/app/app.component.ts";
  const content: Buffer | null = tree.read(path);
  let stringToSearch = "AppComponent";
  const index = content!.indexOf(stringToSearch);

  const updateRecorder = tree.beginUpdate(path);
  updateRecorder.insertRight(
    index + stringToSearch.length,
    ` /* here may be 'extends BlaBlaBla' */ `
  );
  tree.commitUpdate(updateRecorder);

  return tree;
};

export default function mySchematic(options: any): Rule {
  options;
  const rules = [createFile, overwriteFile];
  rules;
  return chain([
    ...rules,
    modifyFile,
    schematic("my-full-schematic", { name: "hack off" })
  ]);
}
