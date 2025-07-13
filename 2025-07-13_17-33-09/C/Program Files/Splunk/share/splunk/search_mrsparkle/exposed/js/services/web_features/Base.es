/* eslint-disable no-underscore-dangle */
import { createRESTURL } from '@splunk/splunk-utils/url';
import { defaultFetchInit, handleResponse, handleError } from '@splunk/splunk-utils/fetch';
import { _ } from '@splunk/ui-utils/i18n';
import querystring from 'querystring';
import { normalizeBoolean } from 'splunk.util';

/*

DO NOT CONSUME THIS FILE DIRECTLY

This service maps to web-features.conf.
For any new feature (stanza), please create a new feature service in this file.
Use QuarantineFiles.es as an example.
All that is required is to pass in your feature name, as defined by the .conf file.

*/

class BaseFeatureService {
    constructor(featureName) {
        this.data = null;
        this.featureName = featureName;
    }

    updateFeatureSettings = (data, app = 'system', owner = 'nobody') =>
        fetch(createRESTURL(`web-features/feature:${this.featureName}?output_mode=json`, { app, owner }), {
            ...defaultFetchInit,
            method: 'POST',
            body: querystring.encode(data),
        });

    _fetchFeatureSettings = ({ app = 'system', owner = 'nobody' }) =>
        fetch(createRESTURL(`web-features/feature:${this.featureName}?output_mode=json`, { app, owner }), {
            ...defaultFetchInit,
            method: 'GET',
        })
        .then(handleResponse(200))
        .catch(handleError(_('Unable to fetch feature settings.')));

    _normalizeBooleanAttributes = data =>
        Object.keys(data).reduce((map, attrKey) =>
            ({ ...map, [attrKey]: normalizeBoolean(data[attrKey]) }), {});

    getFeatureSettings = (opts) => {
        const options = opts || {};
        if (this.data) {
            return Promise.resolve(this.data);
        }
        return this._fetchFeatureSettings(options).then((response) => {
            let data;
            try {
                data = response.entry[0].content;
            } catch (e) {
                data = {};
            }
            const normalizedData = this._normalizeBooleanAttributes(data);
            this.data = normalizedData;
            return normalizedData;
        });
    }

    // Only use this function if it's guaranteed that getFeatureSettings has been resolved previously
    getFeatureSettingsSync = () => this.data;
}

export default BaseFeatureService;
