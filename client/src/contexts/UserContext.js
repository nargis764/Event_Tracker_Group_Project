import { createContext, useState, useEffect } from "react";

const UserContext = createContext(false);

const getExpiryToken = (token) => {
	const localData = JSON.parse(localStorage.getItem("auth"));
	const now = new Date();
	if (!localData) {
		return null;
	}
	console.log(localData);
	return now.getTime > localData.expiry ? null : localData.auth;
};

const getSessionData = () => {
	const session = JSON.parse(sessionStorage.getItem("auth"));
	return session;
};

const UserProvider = ({ children }) => {
	const [auth, setAuth] = useState(getExpiryToken() ? getExpiryToken() : getSessionData());
	const login = (expiry) => {
		setAuth(true);
		if (expiry) {
			const now = new Date();
			const token = {
				auth: true,
				expiry: now.getTime() + 604800000,
			};
			return localStorage.setItem("auth", JSON.stringify(token));
		}
	};

	const logout = () => {
		setAuth(false);
		if (getExpiryToken()) {
			localStorage.removeItem("auth");
		}
		sessionStorage.removeItem("auth");
	};

	useEffect(() => {
		if (auth != null) {
			sessionStorage.setItem("auth", JSON.stringify(auth));
		}
	}, [auth]);

	return <UserContext.Provider value={{ auth, login, logout }}>{children}</UserContext.Provider>;
};
export { UserContext, UserProvider };