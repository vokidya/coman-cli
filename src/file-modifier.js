const getFiles = function(name) {
    const camelCaseName = convertToCamelCase(name);

    return [
        {
            path: `app/form_display/models/form-display-field-model.js`,
            replaceContent: function(content) {
                return content.replace(/(static createFieldModel.*else if.*)(\}\s*else \{)/s, function(searchValue, r1, r2) {
                    return `${r1}} else if (field.is${camelCaseName}) {
        let ${camelCaseName}DisplayFieldModel = $injector.get('${camelCaseName}DisplayFieldModel');
        return new ${camelCaseName}DisplayFieldModel(field, parent, data);
      }
      else {`;
                });
            },
        },
        {
            path: `app/form_editing/directives/form-editing-field-settings.js`,
            regex: /default\:/s,
            replaceContent: function(content) {
                return content.replace(/break;\s*default\:/s, function(searchValue) {
                    return `break;
          case '${name}':
              template = '<${name}-field-setting ng-model="model"></${name}-field-setting>';
              break;
          default:`;
                  })
            }
        },
        {
            path: `app/form_editing/directives/form-editting-field.js`,
            replaceContent: function(content) {
                return content.replace(/break;\s*default\:/s, function(searchValue) {
                    return `break;
          case '${name}':
              template = '<form-editing-${name}-field ng-model="model"></form-editing-${name}-field>';
              break;
          default:`;
                  })
            }
        },
        {
            path: `app/form_editing/models/form-field-model.js`,
            replaceContent: function(content) {
                const content1 = content.replace(/\s*get bindings \(\) \{/s, function(searchValue) {
                    return `
    get is${camelCaseName} () {return this.data.type === '${name}';}

    get bindings () {`;
                });

                return content1.replace(/\}\s*else\s\{\s*\$translate\(\'FORM_MODEL_TYPE_NOT_EXISTED/s, function(s1) {
                    return `} else if (data.type === '${name}') {
        let ${camelCaseName}FieldModel = $injector.get('${camelCaseName}FieldModel');
        return new ${camelCaseName}FieldModel(schema, parent, data);
      ${s1}`
                })
            }
        },
        {
            path: `app/form_editing/templates/form-editing-add-control.html`,
            replaceContent: function(content) {
                return content.replace(/\<\/button\>\s*\<\/div\>\s*\<\/div\>/s, function(searchValue) {
                    return `
    <button class="btn btn-default btn-xs" ng-click="createField('${name}')">${camelCaseName}</button>
  </div>
</div>`;
                  })
            }
        },
    ];
}

function convertToCamelCase(str) {
	return str.replace(/(^|-)([a-z])/g, (match, a1, a2) => {
		return a2.toUpperCase();
	})
}

export {
    getFiles
}
