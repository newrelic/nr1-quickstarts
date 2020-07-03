import React from 'react';

class InstallationInstructions extends React.Component {

    constructor(props) {
        super(props);

        let installation = this.props.sources.sort().map((source, i) => {
            // Speciale case if config specifically set's it's own options
            if (typeof source === 'object' && source !== null) {
                return source;
            }

            switch(source) {
                case 'ComputeSample':
                    return {
                        name: 'New Relic Amazon EC2 monitoring integration',
                        url: 'https://docs.newrelic.com/docs/integrations/amazon-integrations/aws-integrations-list/aws-ec2-monitoring-integration',
                    }
                case 'SystemSample':
                case 'ProcessSample':
                  return {
                    name: 'New Relic Infrastructure',
                    url: 'https://docs.newrelic.com/docs/infrastructure/install-configure-manage-infrastructure'
                  }
                case 'PageView':
                case 'BrowserInteraction':
                case 'JavaScriptError':
                case 'PageViewTiming':
                    return {
                        name: 'New Relic Browser',
                        url: 'https://docs.newrelic.com/docs/browser/new-relic-browser/installation/install-new-relic-browser-agent'
                    }
                case 'SyntheticRequest':
                case 'SyntheticCheck':
                    return {
                        name: 'New Relic Synthetics',
                        url: 'https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/getting-started/introduction-new-relic-synthetics'
                    }
                case 'Transaction':
                    return {
                        name: 'New Relic APM',
                        url: 'https://docs.newrelic.com/docs/apm'
                    }
                case 'Kubernetes':
                case 'K8sContainerSample':
                case 'K8sNodeSample':
                case 'K8sPodSample':
                    return {
                        name: 'New Relic Kubernetes',
                        url: 'https://docs.newrelic.com/docs/integrations/kubernetes-integration/get-started/introduction-kubernetes-integration'
                    }
                case 'Prometheus':
                    return {
                        name: 'New Relic Prometheus Integration',
                        url: 'https://docs.newrelic.com/docs/integrations/prometheus-integrations/install-configure/install-update-or-uninstall-your-prometheus-openmetrics-integration'
                    }
                case 'Log':
                    return {
                        name: 'New Relic Logs',
                        url: 'https://docs.newrelic.com/docs/logs'
                    }
                case 'Flex': // Speciale case for flex metrics
                    return {
                        name: 'New Relic Flex',
                        url: 'https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/flex-integration-tool-build-your-own-integration'
                    }
                case 'Metric': // Case to ingore, as they are general metrics
                    return {};
                default:
                    return {
                      name: 'Unknown source: ' + source,
                    }
            }
        }).sort().filter(function(item, pos, ary) {
            if (!item.name) { return false; }
            return !pos || item.name !== ary[pos - 1].name;
        });

        this.state = {
            requirements: installation
        }
    }

    render() {
        return (
            <div>
                {this.state.requirements.sort((a, b) => (a.name > b.name) ? 1 : -1).map((requirement, i) => {
                    if (requirement.url) {
                        return (
                            <div key={requirement.name}>
                                <h4>{requirement.name}</h4>
                                <p><a href={requirement.url} target="_BLANK" rel="noopener noreferrer">{requirement.url}</a></p>
                            </div>
                        )
                    } else {
                        return ( <li key={requirement.name}>{requirement.name}</li> )
                    }
                })}
            </div>
        );
    }

}

export default InstallationInstructions;
