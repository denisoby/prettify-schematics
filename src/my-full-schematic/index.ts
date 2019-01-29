import {
  Rule,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';


// todo deniso Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function (options: any): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    options;
    context.logger.info('My Full Schematic: ' + JSON.stringify(_tree.actions));
  }
}
