define(
[
    'splunk_monitoring_console/views/settings/forwarder_setup/enterprise/RebuildAssetsDialog'
], function(
    RebuildAssetsDialog
) {
    suite('Build Assets Now', function() {
        setup(function() {
            // Mock XHR
            this.xhr = sinon.useFakeXMLHttpRequest();
            this.requests = [];
            this.xhr.onCreate = function(xhr) {
                this.requests.push(xhr);
            }.bind(this);
            this.view = new RebuildAssetsDialog();

            assert.ok(this.view, 'dialog created');
        });

        teardown(function() {
          this.xhr.restore();
        });

        test('search manager', function() {
            this.view._runRebuildSearch();
            assert.ok(this.view._rebuildForwarderAssetsSearch, 'search manager should have been created');
        });

        test('render', function() {
            this.view.render();

            assert.ok(this.view.children.timeRangePicker, 'DOM should have been created');
        });

        test('time span validation', function() {
            this.view.render();

            assert.equal(this.view.$('.btn').attr('aria-label'), 'Time Range:: Last 24 hours');
            assert.ok(this.view.$('.confirm-rebuild-button'), true);

            this.view.$('.confirm-rebuild-button').click();
            assert.ok(this.view._rebuildForwarderAssetsSearch, 'search manager should have been created');
        });
    });
});
