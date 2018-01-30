import React, { Component } from 'react';

/**
 * Higher Order Component to wrap a component with a prop `windowSize`,
 * which contains `innerWidth` and `innerHeight` and keep these updated. 
 * Additionally contains a constant `mobileMaxWidth` that defines the 
 * maximum window.innerWidth a screen can have in order to still be 
 * considered a 'mobile' screen, rather than a desktop screen.
 * 
 * @param {Component} WrappedComponent component to be wrapped.
 */
function withWindowSize(WrappedComponent) {
    return class withWindowSizeHOC extends Component {
        constructor(props) {
            super();
            this.state = {
                innerWidth: 0,
                innerHeight: 0
            }
            this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        }

        /**
         * Once mounted, updates the window dimensions and registers an event listener.
         */
        componentDidMount() {
            this.updateWindowDimensions();
            window.addEventListener('resize', this.updateWindowDimensions);
        }
        
        /**
         * Before unmounting, clean up event listener.
         */
        componentWillUnmount() {
            window.removeEventListener('resize', this.updateWindowDimensions);
        }

        /**
         * Updates window dimensions, used as callback for event listener.
         */
        updateWindowDimensions() {
            this.setState({ 
                innerWidth: window.innerWidth, 
                innerHeight: window.innerHeight 
            });
        }

        /**
         * Renders the wrapped component with its corresponding props and
         * the functionality of this HOC.
         */
        render() {
            const mobileMaxWidth = 650;

            return (
                <WrappedComponent 
                    windowSize={this.state} 
                    mobileMaxWidth={mobileMaxWidth}
                    isMobile={this.state.innerWidth < mobileMaxWidth} 
                    {...this.props} 
                />
            );
        }
    }
}

export default withWindowSize;