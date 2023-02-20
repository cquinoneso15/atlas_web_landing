const indicators = ["Accessibility", "Exposure", "Availability", "Behaviour"];
const social_groups = ["Total population", "Under 18", "Over 65", "Non-germans"];
const amenities = ["Health", "Education", "Food", "Sports", "Community centers"];

class SelectorButton extends React.Component {
    render() {
        return (
            <button className="selectorButton" value={this.props.name} onClick={this.props.onClick}>{this.props.name}</button>
        );
    }
}

class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator: null,
            social_group: null,
            amenity: null,
            map_type: null
        };
    }

    updateIndicator(e) {
        this.setState({
            indicator: e.target.value,
            social_group: null,
            amenity: null,
            map_type: null
        });

        this.render();
    }

    updateSocialGroup(e) {
        this.setState((state) => ({
            indicator: state.indicator,
            social_group: e.target.value,
            amenity: null,
            map_type: null
        }));

        this.render();
    }

    updateAmenity(e) {
        this.setState((state) => ({
            indicator: state.indicator,
            social_group: state.social_group,
            amenity: e.target.value,
            map_type: null
        }));

        this.render();
    }
    
    render() {
        if (this.state.indicator == null) {
            return (
                <div className="selector">
                    {indicators.map((name) => {return <SelectorButton key={name} name={name} onClick={(e) => {this.updateIndicator(e);}} />})}
                </div>
            );
        } else if (this.state.social_group == null) {
            return (
                <div className="selector">
                    {social_groups.map((name) => {return <SelectorButton key={name} name={name} onClick={(e) => {this.updateSocialGroup(e);}} />})}
                </div>
            );
        } else {
            return (
                <div className="selector">
                    {amenities.map((name) => {return <SelectorButton key={name} name={name} onClick={(e) => {this.updateAmenity(e);}} />})}
                </div>
            );
        }
    }
}

class TUMLogo extends React.Component {
    render() {
        return (
            <svg width="80" height="42" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 38">
                <title>TUM Logo</title>
                <path d="M28 0v31h8V0h37v38h-7V7h-8v31h-7V7h-8v31H21V7h-7v31H7V7H0V0h28z" fill="currentColor"></path>
            </svg>
        );
    }
}

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <TUMLogo/> Mobility (In)justice Atlas
            </div>
        );
    }
}

class SelectorApp extends React.Component {
    render() {
        return (
            <div className="component-app">
                <Header/>
                <Selector/>
            </div>
        );
    }
}

// ========================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SelectorApp />);