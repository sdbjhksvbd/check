import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import Multiselect from '@splunk/react-ui/Multiselect';
import { createTestHook } from 'util/test_support';

const MultiDropdown = ({
    choices,
    disabled,
    allowCustomValues,
    width,
    value,
    onChange,
    label,
}) => (
    <Multiselect
        disabled={disabled}
        allowNewValues={allowCustomValues}
        values={value}
        onChange={(e, { values }) => onChange(values)}
        style={{ width }}
        aria-label={label}
        inline
        {...createTestHook(module.id)}
    >
        {
            choices.map((d) => {
                if (_.isEmpty(d)) {
                    return undefined;
                }
                return (
                    <Multiselect.Option
                        key={d.value}
                        label={String(d.label || d.value)}
                        value={d.value}
                    />);
            })
        }
    </Multiselect>
);

MultiDropdown.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    allowCustomValues: PropTypes.bool,
    width: PropTypes.number,
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
};

MultiDropdown.defaultProps = {
    choices: [],
    disabled: false,
    allowCustomValues: false,
    width: 200,
    minimumResultsForSearch: 8,
    value: [],
    label: '',
};

export default MultiDropdown;
