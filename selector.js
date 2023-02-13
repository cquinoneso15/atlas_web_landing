const indicators = ["Accessibility", "Exposure", "Availability", "Behaviour"];

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
    }
    
    render() {
        return (
            <div className="selector">
                {indicators.map((name) => {return <SelectorButton key={name} name={name} onClick={(e) => {this.updateIndicator(e);}} />})}
            </div>
        );
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
                <TUMLogo/> In(justice) Atlas
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