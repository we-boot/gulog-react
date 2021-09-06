import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Gulog from "gulog-js";

export const GulogContext = createContext<Gulog.Process | undefined>(undefined);

export function useGulog<T extends string = string>(
    type: T,
    initiatorData?: Gulog.InitiatorData,
    parentProcess?: Gulog.Process,
    overrideSettings?: Gulog.Settings
): Gulog.Process<T> {
    const gulogRef = useRef<Gulog.Process<T>>();

    if (!gulogRef.current) {
        gulogRef.current = Gulog.spawn<T>(type, initiatorData, parentProcess, overrideSettings);
    }

    useEffect(() => {
        return () => {
            if (!gulogRef.current!.ended) {
                gulogRef.current!.end("ok");
            }
        };
    }, []);

    return gulogRef.current;
}

export function GulogProvider<T extends string = string>(props: {
    type: T;
    initiatorData?: Gulog.InitiatorData;
    overrideSettings?: Gulog.Settings;
    children: (process: Gulog.Process) => React.ReactNode;
}) {
    const parent = useContext(GulogContext);
    let gulog = useGulog(props.type, props.initiatorData, parent, props.overrideSettings);

    return <GulogContext.Provider value={gulog}>{props.children(gulog)}</GulogContext.Provider>;
}

export * from "gulog-js";
