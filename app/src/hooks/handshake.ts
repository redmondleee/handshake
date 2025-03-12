'use client'

import { useState, useEffect } from "react";
import {
    HandshakeClient,
    ListStudentsCommand,
    Student,
} from "handshake";


const cachedClient = new HandshakeClient({
    endpoint: 'https://l3tah48xad.execute-api.us-west-2.amazonaws.com/prod',
});

export function useListStudents() {
    const [students, setStudents] = useState([] as Student[]);

    useEffect(() => {
        (async () => {
            const response = await cachedClient.send(new ListStudentsCommand());
            setStudents(response.students!);
        })();
    }, []);
  
    return students;
};
