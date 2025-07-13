import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import Button from '@splunk/react-ui/Button';
import Close from '@splunk/react-icons/Close';
import { createTestHook } from 'util/test_support';

const DeleteButton = ({ onClick }) => (
    <Button
        aria-label={_('Delete').t()}
        size="small"
        icon={<Close />}
        appearance="pill"
        onClick={onClick}
        style={{
            flexGrow: '0',
            marginLeft: '5px',
        }}
        {...createTestHook(module.id)}
    />
);

DeleteButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default DeleteButton;
