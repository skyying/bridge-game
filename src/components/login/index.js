import React, {useState, useEffect, useCallback} from "react";
import {Redirect} from "react-router-dom";
import Database from "../../firebase";
import "../../style/signup.scss";
import "../../style/btn.scss";
import "../../style/checkbox.scss";
import Header from "../header";


function redirectToLobbyIfLogin(setRedirect) {
    Database.getCurrentUser()
        .then(user => {
            if (user) {
                setRedirect(true);
                return user;
            } else {
                throw new Error("NO CURRENT USER");
            }
        })
        .catch(error => {
            console.log(error);
        });
}


function trySignIn(email, password, setRedirect, setError) {
    if (!email || !password) return;
    Database.signInWithEmailAndPassword({email, password})
        .then(user => {
            setRedirect(true);
        })
        .catch(error => {
            const {message = ''} = error;
            setError(message);
        });
}

function onChange(setField) {
    return useCallback((evt) => {
        const {currentTarget} = evt;
        setField(currentTarget.value);
    }, setField)
}


export default function Login({isHeaderPanelClosed, currentUser}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null)

    useEffect(() => {
        redirectToLobbyIfLogin(setRedirect)
    }, [])

    // reset Error
    useEffect(() => {
        if (error) {
            setError(null)
        }
    }, [email, password])

    const trySignInFn = useCallback(() => {
        trySignIn(email, password, setRedirect, setError)
    }, [email, password, setRedirect, setError])


    if (redirect) {
        return <Redirect to="/"/>;
    }

    return (
        <div>
            {/*TODO: using context*/}
            <Header
                isHeaderPanelClosed={isHeaderPanelClosed}
                currentUser={currentUser}
            />
            <div className="singup-wrapper">
                <div className="signup login">
                    <h2>Login</h2>
                    <div>
                        <h3>Email</h3>
                        <input
                            type="text"
                            placeholder="Email address"
                            onChange={onChange(setEmail)}
                            value={email}
                        />
                    </div>
                    <div>
                        <h3>Password</h3>
                        <input
                            placeholder="Enter password"
                            type="password"
                            onChange={onChange(setPassword)}
                            value={password}
                        />
                    </div>
                    <div className="error-text">
                        {error}
                    </div>
                    <div>
                        <div className="btn-group">
                            <button
                                onClick={trySignInFn}
                                className="btn-style-round">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

