import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';


export function mySchematic(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    options;
    context;
    tree.create('hello.ts', 'class ClassWithOutFormatting{ public x = 1; y = function(){return 2}}');
    return tree;
  };
}
