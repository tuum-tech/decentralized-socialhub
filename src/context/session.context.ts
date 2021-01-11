import React from 'react';

export interface ISession{
    session?: any,
    setSession?: any
}

const SessionContext = React.createContext<ISession>({});

export default SessionContext;