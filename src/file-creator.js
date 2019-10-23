const getFiles = function(name) {
    const camelCaseName = convertToCamelCase(name);
    const lowerCamelCaseName = convertToLowerCamelCase(name);

    return [
        {
            path: `./app/form_display/${name}/form-display-${name}-field.html`,
            content: `<div class="form-group" ng-style="{'background-color': model.field.color || '#FFFFFF'}">
    <input class="control-label" ng-if="model.value" alt="DemoInput" />
</div>`
        },
        {
            path: `./app/form_display/${name}/form-display-${name}-field.js`,
            content: `import app from '/app';

app.directive('formDisplay${camelCaseName}Field', () => {
  return {
    restrict: 'E',
    scope: {
        model: '=ngModel'
    },
    link: function (scope) {
    },
    templateUrl:'form_display/${name}/form-display-${name}-field.html'
    };
});
`
        },
        {
            path: `./app/form_display/${name}/${name}-display-field-model.js`,
            content: `import app from '/app';

app.factory('${camelCaseName}DisplayFieldModel', (ObjectDisplayFieldModel) => {
    class ${camelCaseName}DisplayFieldModel extends ObjectDisplayFieldModel {
    constructor (field, parent, data) {
        super(field, parent, data);
        this.type = '${name}';
    }
    }

    return ${camelCaseName}DisplayFieldModel;
});
`
        },
        {
            path: `./app/form_editing/${name}/${name}-field-model.js`,
            content: `import app from '/app';

app.factory('${camelCaseName}FieldModel', (FormFieldModel) => {
    class ${camelCaseName}FieldModel extends FormFieldModel {
    constructor (formModel, parent, data) {
        super(formModel, parent, data);
        this.bindingFilter = (schema) => { return schema.isBool || schema.isString || schema.isInt; };
    }
    }

    return ${camelCaseName}FieldModel;
});
`
        },
        {
          path: `./app/form_editing/${name}/form-editing-${name}-field.html`,
          content: `<input type="text" class="form-control" placeholder="Text">`
        },
        {
          path: `./app/form_editing/${name}/form-editing-${name}-field.js`,
          content: `import app from '/app';

app.directive('formEditing${camelCaseName}Field', () => {
  return {
    restrict: 'E',
    scope: {},
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      ngModelCtrl.$render = function () {
      };
    },
    templateUrl:'form_editing/${name}/form-editing-${name}-field.html'
  };
});
`
        },
        {
          path: `./app/form_editing/${name}/setting/${name}-field-setting.html`,
          content: `<title-setting ng-model="model"></title-setting>
<binding-setting ng-model="model"></binding-setting>
<display-setting ng-model="model"></display-setting>`
        },
        {
          path: `./app/form_editing/${name}/setting/${name}-field-setting.js`,
          content: `import app from '/app';

app.directive('${lowerCamelCaseName}FieldSetting', () => {
  return {
    restrict: 'E',
    scope: {},
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      ngModelCtrl.$render = function () {
          scope.model = ngModelCtrl.$viewValue;
      };
    },
    templateUrl:'form_editing/${name}/setting/${name}-field-setting.html'
  };
});
`
        },
    ];
}

function convertToCamelCase(str) {
	return str.replace(/(^|-)([a-z])/g, (match, a1, a2) => {
		return a2.toUpperCase();
	})
}

function convertToLowerCamelCase(str) {
	return str.replace(/(-)([a-z])/g, (match, a1, a2) => {
		return a2.toUpperCase();
	})
}

export {
    getFiles
}
