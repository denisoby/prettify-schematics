import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  schematic,
  template,
  url,
} from '@angular-devkit/schematics';


// todo deniso Instead of `any`, it would make sense here to get a schema-to-dts package and output the
// interfaces so you get type-safe options.
export default function (options: any): Rule {
  return chain([
    (_tree: Tree, context: SchematicContext) => {
      context.logger.info('My Full Schematic: ' + JSON.stringify(options));
    },

    schematic('my-other-schematic', { option: true }),

    mergeWith(apply(url('./files'), [
      template({
        INDEX: options.index,
        name: options.name,
      }),
    ])),
  ]);
}
