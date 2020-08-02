import {firebaseApp} from "../firebase/index";
import {useEffect, useState, useRef, useCallback} from 'react';

function usePathOnce(path: string): string[] {
    const [value, setValue] = useState(null);

    useEffect(() => {
        if (path) {
             firebaseApp
                .database()
                .ref(path)
                .once("value").then(snapshot => {
                setValue(snapshot.val())
            });
        }
    }, [path])

    return [value];
}


export default function useCurrentUser(): { user: any, userInfo: any } {
    const [user, setUser] = useState(null);
    const [path, setPath] = useState(null);
    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged(user => {
            setUser(user)
        });
    })
    useEffect(() => {
        setPath(`uid` in (user || {}) && `users/${user.uid}` || null);
    }, [user, path])
    useEffect(() => {
    }, [user])

    const [val = null] = usePathOnce(path)

    return {user, userInfo: val}
};

