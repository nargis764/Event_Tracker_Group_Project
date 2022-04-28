import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
// import Modal from "react-bootstrap/Modal";

const Login = (props) => {
	// const { login } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [checked, setChecked] = useState(false);

	const navigate = useNavigate();

	const handleCheck = () => {
		setChecked(!checked);
	};

	const handleLogin = (event) => {
		event.preventDefault();
		axios
			.post(
				"http://localhost:8000/api/users/login",
				{
					email: email,
					password: password,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				// login(checked);
				console.log(res, "res");
				console.log(res.data, "is res data!");
				setEmail("");
				setPassword("");
				navigate("/all");
			})
			.catch((err) => {
				console.log(err);
				setErrorMessage(err.response.data.message);
			});
	};

	return (
		<div>
			<h2 className="text-center text-primary">Login</h2>
			<Form onSubmit={handleLogin}>
				<FormGroup className="mt-2">
					{/* <Form.Label>Email address</Form.Label> */}
					<Form.Control type="text" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
				</FormGroup>

				<FormGroup className="mt-4">
					{/* <Form.Label>Password</Form.Label> */}
					<Form.Control
						type="password"
						name="password"
						value={password}
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</FormGroup>
				<FormGroup className="mt-4 ">
					<Form.Check checked={checked} onChange={handleCheck} className="ml-4 d-inline-block" />
					<Form.Label className="mx-2">Stay Logged in for 7 days</Form.Label>
				</FormGroup>

				<p className="error-text mt-2" style={{ color: "red" }}>
					{errorMessage ? errorMessage : ""}
				</p>

				<button
					className="mt-2 px-4"
					style={{
						background: "#0d6efd",
						height: "40px",
						color: "#ffffff",
						borderRadius: "5px",
						border: "none",
					}}
				>
					Login
				</button>
			</Form>
		</div>
	);
};

export default Login;