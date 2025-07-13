define(
    [
        'underscore',
        'models/datasets/commands/Base'
    ],
    function(
        _,
        BaseCommand
    ) {
        var Duplicate = BaseCommand.extend({
            _displayName: _('Duplicate').t(),
            _placeholderSPL: 'eval',
            _advancedCommand: BaseCommand.EVAL,

            initialize: function(attributes, options) {
                BaseCommand.prototype.initialize.apply(this, arguments);
            },

            defaults: function() {
                return Duplicate.getDefaults();
            },

            validation: {
                spl: 'validateSPL',
                collisionFields: 'validateCollisionFields'
            },

            validateSPL: function(value, attr, option) {
                var newFieldName = this.get('newFieldName'),
                    invalidFieldMessage = this.validateFieldName(newFieldName);

                if (!this.hasValidRequiredColumn()) {
                    return _('Select a field to duplicate.').t();
                }

                if (invalidFieldMessage) {
                    return invalidFieldMessage;
                }
            },

            generateSPL: function(options) {
                options = options || {};

                if (!options.skipValidation && !this.isValid(true)) {
                    throw new Error('Duplicate must be in a valid state before you can generate SPL.');
                }

                var newFieldName = this.get('newFieldName'),
                    duplicatedFieldName = this.getExpression();

                return 'eval "' + newFieldName + '"=' + duplicatedFieldName;
            },

            getAdvancedCommandAttributes: function() {
                return {
                    newFieldName: this.get('newFieldName'),
                    expression: this.getExpression()
                };
            },

            getExpression: function() {
                if (this.hasValidRequiredColumn()) {
                    return this.getFieldNameFromGuid(this.requiredColumns.first().get('id'), { singleQuoteWrap: true });
                } else {
                    return '\'\'';
                }
            }
        }, {
            blacklist: [
                { selection: BaseCommand.SELECTION.CELL },
                { selection: BaseCommand.SELECTION.TABLE },
                { selection: BaseCommand.SELECTION.TEXT },
                { selection: BaseCommand.SELECTION.MULTICOLUMN }
            ],
            getDefaults: function(overrides) {
                return _.defaults((overrides || {}), {
                    type: BaseCommand.DUPLICATE,
                    newFieldName: ''
                }, BaseCommand.getDefaults());
            }
        });

        return Duplicate;
    }
);
