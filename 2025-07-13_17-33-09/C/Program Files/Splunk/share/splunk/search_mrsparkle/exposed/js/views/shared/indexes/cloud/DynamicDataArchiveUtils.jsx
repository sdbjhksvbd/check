import React from 'react';
import moment from '@splunk/moment';
import Message from '@splunk/react-ui/Message';
import Success from '@splunk/react-icons/Success';
import InfoCircle from '@splunk/react-icons/InfoCircle';
import Error from '@splunk/react-icons/Error';
import { _ } from '@splunk/ui-utils/i18n';
import { error, success, info, warning } from './RestoreArchive.pcss';  // eslint-disable-line no-unused-vars

export const emptyTemplate = (<Message type="info">
    {_('There is no archive retrieval history.')}</Message>);
export const emptyArchiveTemplate = (<Message type="info">
    {_('There are no indices with archives.')}</Message>);
export const headers = ['IndexName', 'StartTime', 'EndTime', 'RequestTime', 'Description', 'State', 'DataVolumeInGB'];
export const localisedStrings = {
    IndexName: _('Index Name'),
    StartTime: _('Earliest Event'),
    EndTime: _('Latest Event'),
    RequestTime: _('Request Time'),
    EmailAddresses: _('Email Addresses'),
    Description: _('Description'),
    State: _('State'),
    DataVolumeInGB: _('Data Volume (GB)'),
    RequestId: _('Request Id'),
};

export function convertToGB(size) {
    // Use same measure for GB as splunkd does: 1024^3
    const realMB = 1024 * 1024;
    const realGB = realMB * 1024;
    const inGb = (size / realGB.toFixed(2));
    if (size > realMB) {  // if size is more than an MB then round off to precision 4
        return inGb.toFixed(4).replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
    }
    return inGb.toFixed(9).replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
}

export function getFormattedValue(key, value) {
    if (key.indexOf('Time') !== -1 || key === 'earliest' || key === 'latest') {
        return moment(value * 1000).format('YYYY/MM/DD hh:mm:ss A');
    } else if (key === 'State') {
        if (value === 'Flushed') {
            return _('Cleared');
        }
        return value.split('.')[0];
    } else if (key === 'raw_size' || key === '90-day-expired' || key === '90-day-archived') {
        return convertToGB(value);
    }
    return value;
}

export function getExpirationDate(requestTime) {
    return moment(requestTime * 1000).add(30, 'days').format('YYYY/MM/DD hh:mm:ss A');
}

export function getStateIcon(key) {
    const state = key.split('.')[0];
    switch (state) {
        case 'Success':
        case 'Flushed':
            return (<Success size={1} style={{ color: success, marginRight: '5px' }} />);
        case 'Failed':
            return (<Error size={1} style={{ color: error, marginRight: '5px' }} />);
        default:
            return (<InfoCircle size={1} style={{ color: info, marginRight: '5px' }} />);
    }
}

export function constructHistoryData(indexName = '', sortKey = '', sortDir = '') {
    return Object.assign({ count: 50, output_mode: 'json' },
        !indexName ? null : { index_name: indexName },
        !sortKey ? { sort_key: 'IndexName' } : { sort_key: sortKey },
        !sortDir ? { sort_direction: 'ltog' } : { sort_direction: sortDir === 'asc' ? 'ltog' : 'gtol' });
}

export const convertDateToSeconds = value => moment(value).startOf('day').valueOf() / 1000;

export function getMsgType(status) {
    switch (status) {
        case 'Blocked':
        case 'Empty':
        case 'Overlap':
        case 'Error':
            return 'error';
        case 'Warning':
            return 'warning';
        case 'Success':
        case 'Flushed':
            return 'success';
        default:
            return 'info';
    }
}

export function getAdditionalStateInfo(state) {
    switch (state) {
        case 'InProgress.CallingRestoreAPI':
            return _('Data restoration request initiated.');
        case 'InProgress.RestoreAPICalled':
            return _('Data restoration request completed. Wait for 4-6 hours for the data to be restored.');
        case 'InProgress.DoingPostProcessing':
            return _('Finalizing data restoration from the archive.');
        case 'Failed.CallingRestoreAPI':
            return _('Failed to restore data from archive. Initiate the restoration request again.');
        case 'Failed.DoingPostProcessing':
            return _('Failed to finalize the data restoration request. Initiate the restoration request again.');
        case 'Pending':
            return _('Preparing the request for data restoration.');
        case 'Success':
            return _('Successfully completed the data restoration.');
        case 'Expired':
            return _('Data restoration request expired.');
        case 'Flushed':
            return _('Successfully cleared the restored copy of the archived data.');
        default:
            return _('Not available.');
    }
}

export function getRestoreHistoryColumns(items) {
    let columns = [];
    if (items.length) {
        columns = headers.map(col => ({
            sortKey: col,
            label: (col === 'State') ? _('Job Status') : localisedStrings[col],
        }));
    }
    return columns;
}

export function getNextSortDir(currentKey, currentDir, nextKey) {
    const prevSortKey = currentKey;
    const prevSortDir = prevSortKey === nextKey ? currentDir : 'none';
    return (prevSortDir === 'asc' ? 'desc' : 'asc');
}

