import { configure, mount } from 'enzyme';
import EnzymeAdapterReact16 from 'enzyme-adapter-react-16';
import React from 'react';
import { AssistLite, ErrorPrompt, UnactivatedPrompt } from '../../../../src/views/overview/assist_summary/components/AssistLite';
import { AssistMarketing } from '../../../../src/views/overview/assist_summary/components/AssistMarketing';
import { getSeverityPercentStr, IndicatorSummary } from '../../../../src/views/overview/assist_summary/components/IndicatorSummary';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';
import { SummaryCount, SummaryIcon, SummarySubtext, SummaryTitle } from '../../../../src/views/overview/assist_summary/styles/IndicatorSummary.styles';

const mockIndicatorTotals = {
    critical: 5,
    warning: 10,
    conforming: 20,
    total: 35,
}

suite('AssistLite', function () {
    setup(() => {
        configure({ adapter: new EnzymeAdapterReact16() });
    });

    test('Tests loading view', () => {
        const wrapper = mount(
            <AssistLite
                isLoading={true}
                isError={false}
                isActivated={false}
                indicatorTotals={null}
            />
        );
        assert.ok(wrapper, 'wrapper instantiated successfully');
        assert.equal(wrapper.find(WaitSpinner).length, 1);
        assert.equal(wrapper.find(AssistMarketing).length, 1, 'marketing material should always show');
        assert.equal(wrapper.find(IndicatorSummary).length, 0);
        assert.equal(wrapper.find(UnactivatedPrompt).length, 0);
        assert.equal(wrapper.find(ErrorPrompt).length, 0);
    });

    test('Tests activated view', () => {
        const wrapper = mount(
            <AssistLite
                isLoading={false}
                isError={false}
                isActivated={true}
                indicatorTotals={mockIndicatorTotals}
            />
        );
        assert.ok(wrapper, 'wrapper instantiated successfully');
        assert.equal(wrapper.find(WaitSpinner).length, 0);
        assert.equal(wrapper.find(AssistMarketing).length, 1, 'marketing material should always show');
        assert.equal(wrapper.find(UnactivatedPrompt).length, 0);
        assert.equal(wrapper.find(ErrorPrompt).length, 0);

        const indicatorSummaryComponent = wrapper.find(IndicatorSummary);
        assert.equal(indicatorSummaryComponent.length, 1);
        assert.equal(indicatorSummaryComponent.first().props().indicatorTotals, mockIndicatorTotals, 'indicator counts passed to component');
    });

    test('Tests unactivated view', () => {
        const wrapper = mount(
            <AssistLite
                isLoading={false}
                isError={false}
                isActivated={false}
                indicatorTotals={null}
            />
        );

        assert.ok(wrapper, 'wrapper instantiated successfully');
        assert.equal(wrapper.find(WaitSpinner).length, 0);
        assert.equal(wrapper.find(AssistMarketing).length, 1, 'marketing material should always show');
        assert.equal(wrapper.find(UnactivatedPrompt).length, 1);
        assert.equal(wrapper.find(ErrorPrompt).length, 0);

        const indicatorSummaryComponent = wrapper.find(IndicatorSummary);
        assert.equal(indicatorSummaryComponent.length, 1);
        assert.equal(indicatorSummaryComponent.first().props().indicatorTotals, null, 'indicator counts passed to component');
    });

    test('Tests error in getting activation status', () => {
        const wrapper = mount(
            <AssistLite
                isLoading={false}
                isError={true}
                isActivated={false}
                indicatorTotals={null}
            />
        );
        assert.ok(wrapper, 'wrapper instantiated successfully');
        assert.equal(wrapper.find(WaitSpinner).length, 0);
        assert.equal(wrapper.find(AssistMarketing).length, 1, 'marketing material should always show');
        assert.equal(wrapper.find(UnactivatedPrompt).length, 0);
        assert.equal(wrapper.find(ErrorPrompt).length, 1);
        assert.equal(wrapper.find(IndicatorSummary).length, 1, 'summary should still be visible but N/As will be shown');
    });
    test('Tests error in getting indicators', () => {
        const wrapper = mount(
            <AssistLite
                isLoading={false}
                isError={true}
                isActivated={true}
                indicatorTotals={null}
            />
        );
        assert.ok(wrapper, 'wrapper instantiated successfully');
        assert.equal(wrapper.find(WaitSpinner).length, 0);
        assert.equal(wrapper.find(AssistMarketing).length, 1, 'marketing material should always show');
        assert.equal(wrapper.find(UnactivatedPrompt).length, 0);
        assert.equal(wrapper.find(ErrorPrompt).length, 1);
        assert.equal(wrapper.find(IndicatorSummary).length, 1, 'summary should still be visible but N/As will be shown');
    });
});

suite('IndicatorSummary', () => {
    setup(() => {
        configure({ adapter: new EnzymeAdapterReact16() });
    });

    const assertTitles = (wrapper) => {
        // Check length
        const titles = wrapper.find(SummaryTitle);
        assert.equal(titles.length, 3)

        // Check placement
        for (let i = 0; i < 3; i++) {
            const el = titles.at(i);
            const text = el.text();
            const props = el.props();
            assert.equal(props.row, '1')

            if (text == 'Critical Indicators') {
                assert.equal(props.col, '3 / 7')
            } else if (text === 'Warning Indicators') {
                assert.equal(props.col, '7 / 11')
            } else if (text === 'Conforming Indicators') {
                assert.equal(props.col, '11 / 14')
            } else {
                assert.fail(`unexpected title value: ${text}`);
            }
        }
    }

    const assertIcons = (wrapper) => {
        // Check length
        const icons = wrapper.find(SummaryIcon);
        assert.equal(icons.length, 3)

        // Check placement
        for (let i = 0; i < 3; i++) {
            const el = icons.at(i);
            const text = el.text().trim();
            const props = el.props();

            // row 
            if (props.disabled) {
                assert.equal(props.row, '2')
            } else {
                assert.equal(props.row, '2 / 4')
            }

            // col
            if (text == 'critical') {
                assert.equal(props.col, '3')
            } else if (text === 'warning') {
                assert.equal(props.col, '7')
            } else if (text === 'conforming') {
                assert.equal(props.col, '11')
            } else {
                assert.fail(`unexpected icon label: ${text}`);
            }
        }

    }

    const assertCounts = (wrapper) => {
        // Check length
        const counts = wrapper.find(SummaryCount);
        assert.equal(counts.length, 3)

        // Check placement
        for (let i = 0; i < 3; i++) {
            const el = counts.at(i);
            const text = el.text();
            const props = el.props();

            // row 
            assert.equal(props.row, '2')

            // col
            const testLabel = 'data-test-name';
            if (props[testLabel] == 'critical-count') {
                assert.equal(props.col, '4 / 7')

                // data
                if (props.disabled) {
                    assert.equal(text, 'N/A')
                } else {
                    assert.equal(text, mockIndicatorTotals.critical);
                }
            } else if (props[testLabel] == 'warning-count') {
                assert.equal(props.col, '8 / 11');

                // data
                if (props.disabled) {
                    assert.equal(text, 'N/A')
                } else {
                    assert.equal(text, mockIndicatorTotals.warning);
                }
            } else if (props[testLabel] == 'conforming-count') {
                assert.equal(props.col, '12 / 14')

                // data
                if (props.disabled) {
                    assert.equal(text, 'N/A')
                } else {
                    assert.equal(text, mockIndicatorTotals.conforming);
                }
            } else {
                assert.fail(`unexpected count test label: ${props[testLabel]}`);
            }
        }
    }

    const assertSubtexts = (wrapper, indicatorTotals = mockIndicatorTotals) => {
        const isNoData = !indicatorTotals;

        // Check length
        const subtexts = wrapper.find(SummarySubtext);
        assert.equal(subtexts.length, 3)

        const expectedConformingSubtext = getSeverityPercentStr('conforming', indicatorTotals);
        const expectedWarningSubtext = getSeverityPercentStr('warning', indicatorTotals);
        const expectedCriticalSubtext = getSeverityPercentStr('critical', indicatorTotals);

        // Check placement
        for (let i = 0; i < 3; i++) {
            const el = subtexts.at(i);
            const text = el.text();
            const props = el.props();
            assert.equal(props.row, '3')

            const testLabel = 'data-test-name';
            if (props[testLabel] == 'critical-percent') {
                assert.equal(props.col, '4 / 7')
                if (isNoData) {
                    assert.equal(text, '')
                } else {
                    assert.equal(text, expectedCriticalSubtext);
                }
            } else if (props[testLabel] == 'warning-percent') {
                assert.equal(props.col, '8 / 11')
                if (isNoData) {
                    assert.equal(text, '')
                } else {
                    assert.equal(text, expectedWarningSubtext);
                }
            } else if (props[testLabel] == 'conforming-percent') {
                assert.equal(props.col, '12 / 14')
                if (isNoData) {
                    assert.equal(text, '')
                } else {
                    assert.equal(text, expectedConformingSubtext);
                }
            } else {
                assert.fail(`unexpected subtext test label value: ${props[testLabel]}`);
            }
        }
    };

    test('Tests summary indicator counts content and order W/O no data', () => {
        const wrapper = mount(
            <IndicatorSummary indicatorTotals={null} />
        );
        assert.ok(wrapper, 'wrapper instantiated successfully');

        assertTitles(wrapper);
        assertIcons(wrapper);
        assertCounts(wrapper);
        assertSubtexts(wrapper, null);
    });

    test('Tests summary indicator counts content and order WITH data', () => {
        const wrapper = mount(
            <IndicatorSummary indicatorTotals={mockIndicatorTotals} />
        );
        assert.ok(wrapper, 'wrapper instantiated successfully');

        assertTitles(wrapper);
        assertIcons(wrapper);
        assertCounts(wrapper);
        assertSubtexts(wrapper);
    });

    test('Tests that summary subtexts are formatted correctly', () => {
        const indicatorTotals = {
            critical: 2,
            warning: 1,
            conforming: 20,
            total: 1001,
        }
        const wrapper = mount(
            <IndicatorSummary indicatorTotals={indicatorTotals} />
        );

        assertSubtexts(wrapper, indicatorTotals);
    });
});