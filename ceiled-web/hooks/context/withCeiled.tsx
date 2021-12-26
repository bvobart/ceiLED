import React, { ComponentType } from 'react';
import { BrightnessProvider } from './BrightnessContext';
import { SocketProvider } from './SocketContext';
import { StatusProvider } from './StatusContext';

/**
 * withCeiled is a higher-order (functional) component made to wrap the wrapped component
 * in the context providers that CeiLED uses.
 * @param Component your main App component
 */
export function withCeiled<P>(Component: ComponentType<P>): ComponentType<P> {
  return function WithCeiled(props: P) {
    return (
      <SocketProvider>
        <StatusProvider>
          <BrightnessProvider>
            <Component {...props} />
          </BrightnessProvider>
        </StatusProvider>
      </SocketProvider>
    );
  };
}
