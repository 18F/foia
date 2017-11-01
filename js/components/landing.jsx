import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { requestActions } from 'actions';
import AgencyComponentFinder from 'components/agency_component_finder';
import AgencyComponentPreview from 'components/agency_component_preview';
import AgencyPreview from 'components/agency_preview';
import agencyComponentStore from '../stores/agency_component';


class LandingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agency: null,
      agencyComponent: null,
      agencyComponentsForAgency: null,
    };
  }

  setStateForAgency(agency, agencyComponentsForAgency) {
    this.setState({
      agency,
      agencyComponent: null,
      agencyComponentsForAgency,
    });
  }

  setStateForComponent(agencyComponent, isCentralized = false) {
    this.setState({
      agency: null,
      agencyComponent,
      agencyComponentsForAgency: null,
      isCentralized,
    });
  }

  render() {
    // Note that the agencyComponent comes from two different sources, so the
    // properties might not be consistent.
    const agencyChange = (agencyComponent) => {
      function fetchAgencyComponent(agencyComponentId) {
        return requestActions.fetchAgencyComponent(agencyComponentId)
          .then(requestActions.receiveAgencyComponent)
          .then(() => agencyComponentStore.getAgencyComponent(agencyComponentId));
      }

      if (agencyComponent.type === 'agency_component') {
        fetchAgencyComponent(agencyComponent.id)
          .then(component => this.setStateForComponent(component, false));
        return;
      }

      const agency = agencyComponentStore.getAgency(agencyComponent.id);

      // Treat centralized agencies as components
      if (agency.isCentralized()) {
        const component = agencyComponentStore
          .getState()
          .agencyComponents
          .find(c => c.agency.id === agency.id);
        fetchAgencyComponent(component.id)
          .then(c => this.setStateForComponent(c, true));
        return;
      }

      const agencyComponentsForAgency =
        agencyComponentStore.getAgencyComponentsForAgency(agency.id);
      this.setStateForAgency(agency, agencyComponentsForAgency);
    };

    const { agencies, agencyComponents, agencyFinderDataComplete } = this.props;
    return (
      <div className="usa-grid">
        <h2>
          Select an agency to start your request or to see an agency’s contact information:
        </h2>
        <AgencyComponentFinder
          agencies={agencies}
          agencyComponents={agencyComponents}
          agencyFinderDataComplete={agencyFinderDataComplete}
          onAgencyChange={agencyChange}
        />
        {
          !this.state.agencyComponent && !this.state.agency &&
          <p>Remember that some agencies have existing FOIA portals and will
          continue to receive requests through their current portals. All
          agencies are working towards becoming interoperable with FOIA.gov.
          The information for where to submit a request to those agencies
          will be available after you select an agency above.</p>
        }
        {
          this.state.agencyComponent &&
          <AgencyComponentPreview
            agencyComponent={this.state.agencyComponent.toJS()}
            isCentralized={this.state.isCentralized}
            onAgencySelect={agencyChange}
          />
        }
        {
          this.state.agency &&
          <AgencyPreview
            agency={this.state.agency}
            agencyComponentsForAgency={this.state.agencyComponentsForAgency}
            onAgencySelect={agencyChange}
          />
        }
      </div>
    );
  }
}

LandingComponent.propTypes = {
  agencies: PropTypes.object.isRequired,
  agencyComponents: PropTypes.object.isRequired,
  agencyFinderDataComplete: PropTypes.bool.isRequired,
};

export default LandingComponent;
