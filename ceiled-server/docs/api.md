# `ceiled-server` API Documentation

The `ceiled-server` hosts a `socket.io` WebSocket API, hosted per default on port 6565. Other APIs, including some REST-like endpoints may be added at a later stage.

## WebSocket API

This API is hosted over a WebSocket connection and uses the [`socket.io`](socket.io) library on the server side. This library is also necessary on the client side to make use of the API.

The idea of this API is simple: once connected, there are a number of events on which requests can be sent to the server and messages are emitted back to the client. These events are as follows:

- `brightness`
- `roomlight`
- `flux`
- `ceiled`
- `server`
- `errors`

### Authorisation

Every request sent over this API needs to be authorised with an authorisation token. See the 'About' page on [bart.vanoort.is](bart.vanoort.is) to learn more about this token.

### Events: `brightness`, `roomlight` and `flux`

These events are used to control and receive updates about the brightness, roomlight and flux settings.

#### Request: Get current brightness / roomlight / flux

```typescript
{
  authToken: string, // Authorisation Token
  action: 'get',
}
```

#### Request: Set brightness / roomlight / flux

```typescript
{
  authToken: string, // Authorisation Token
  action: 'set',
  value: number,     // value to be set, between 0 - 255
}
```

#### Responses

The server will exclusively emit respectively the brightness, roomlight and flux values on these events. This is simply just a number.

### Event: `ceiled`

This event is the 'main' API as this is the event on which the requests are sent to change the currently displayed pattern, as well as where updates about newly set patterns are sent. These updates are only sent when other clients have performed the requests to change the patterns.

#### Request: Turn off all lights

```typescript
{
  authToken: string,
  action: 'off',
}
```

#### Request: Get current pattern

```typescript
{
  authToken: string, // Authorisation Token
  action: 'get',
  channel: number,   // the channel number from which to get the current pattern
}
```

#### Request: Set a pattern

```typescript
{
  authToken: string,       // Authorisation Token
  action: 'set',
  channel: number | 'all', // the channel on which to set the pattern, or 'all' if it should be applied to all channels
  pattern: Pattern,        // the pattern to be set. See below.
}
```

#### Request: Set multiple patterns

```typescript
{
  authToken: string,              // Authorisation Token
  action: 'set',
  patterns: Map<number, Pattern>, // mapping of channel numbers to the patterns that should be displayed on them.
}
```

#### Request: Set animations

```typescript
{
  authToken: string,                  // Authorisation Token
  action: 'set',
  animations: Map<number, Pattern[]>, // mapping of channel numbers to a list of patterns that form the animation.
}
```

#### Request: Set animation speed

```typescript
{
  authToken: string,  // Authorisation Token
  action: 'set',
  speed: number,      // desired speed of the animation, in BPM.
}
```

#### Response: Get current pattern / single new pattern was set.

```typescript
{
  channel: number | 'all',
  pattern: Pattern,
}
```

#### Response: Get multiple current patterns / multiple new patterns were set

```typescript
{
  patterns: Map<number, Pattern>,
}
```

#### Response: Get multiple current patterns / new animations were set

```typescript
{
  animations: Map<number, Pattern[]>
}
```

### Event: `server`

This event is solely used to convey messages about the server's operation to the clients. The only message sent over this event currently is a message `closing`, just prior to the server shutting down.

### Event: `errors`

This event is used by the server to emit errors to the client(s). Every error message emitted on this event is structured as follows, but may also contain other properties:

```typescript
{
  message: string;
} // human-readable description of the error
```

Specifically in the current implementation there are three error messages:

#### Unauthorised error message

```typescript
{
  message: 'You are not authorised to do that';
}
```

#### Invalid request message

```typescript
{
  message: 'Invalid request',
  event: string, // corresponds to one of the API's events on which the request was originally sent
  request: any, // the request that was sent, that is apparently invalid
}
```

#### Internal error message

```typescript
{
  message: string,
  event: string, // corresponds to one of the API's events on which the request was originally sent
  request: any, // the request that was sent which caused the error
  stackTrace: string, // the stack trace that the internal error caused
}
```

### Patterns

There are currently three supported patterns:

- Solid
- Fade
- Mood

TODO: write more documentation about this sometime. Until then, inspect the code in `ceiled-server/src/patterns`.
