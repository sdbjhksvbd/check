import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import RadioList from '@splunk/react-ui/RadioList';
import { createTestHook } from 'util/test_support';

const RadioGroup = ({
    value = null,
    choices,
    disabled,
    onChange,
    labelledBy,
}) => {
    // This is to be consistent with the old backbone-based implementation.
    // It shows one radio button with empty label to indicate there's a RadioGroup exists.
    const c = choices.length > 0 ? choices : [{ label: ' ', value: '' }];

    return (
        <RadioList
            value={value}
            labelledBy={labelledBy}
            disabled={disabled}
            onChange={(e, data) => {
                onChange(data.value);
            }}
            {...createTestHook(module.id)}
        >
            {c.map((choice) => {
                const option = _.isEmpty(choice) ? { label: ' ', value: '' } : choice;
                return (
                    <RadioList.Option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label || option.value}
                    </RadioList.Option>
                );
            })}
        </RadioList>
    );
};

RadioGroup.propTypes = {
    // empty string is a valid value so that we cannot set its default value to empty string
    value: PropTypes.string,    // eslint-disable-line react/require-default-props
    choices: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    labelledBy: PropTypes.string,
};

RadioGroup.defaultProps = {
    choices: [],
    disabled: false,
    labelledBy: '',
};

export default RadioGroup;
