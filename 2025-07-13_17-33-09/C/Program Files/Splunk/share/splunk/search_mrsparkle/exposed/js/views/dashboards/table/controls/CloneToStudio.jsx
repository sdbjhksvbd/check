import React from 'react'; // eslint-disable-line no-unused-vars
import { getCurrentTheme, SplunkThemeProvider } from 'util/theme_utils';
import CloneDashboard from '@splunk/enterprise-dashboard-dialogs/CloneDashboard';

// This is a theme wrapper for the Clone to Dashboard Studio dialog
export default props => (
    <SplunkThemeProvider {...getCurrentTheme()}>
        <CloneDashboard {...props} />
    </SplunkThemeProvider>);