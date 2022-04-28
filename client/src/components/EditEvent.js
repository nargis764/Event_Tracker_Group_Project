import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import FileBase64 from "react-file-base64";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { UserContext } from "../contexts/UserContext";

const EditEvent = (props) => {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	// const [location, setLocation] = useState({ streetAddress: "" });
	const [zipcode, setZipcode] = useState("");
	const [img, setImg] = useState("");
	const [time, setTime] = useState("");
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState({});
	const [streetAddress, setStreetAddress] = useState("");
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		axios
			.get("http://localhost:8000/api/events/" + id, { withCredentials: true })
			.then((res) => {
				console.log(res.data[0]);
				setName(res.data[0].name);
				setCategory(res.data[0].category);
				setImg(res.data[0].img);
				setTime(res.data[0].time);
				setDate(res.data[0].date);
				setStreetAddress(res.data[0].location.streetAddress);
				setDescription(res.data[0].description);
			})
			.catch((err) => console.error(err));
	}, []);

	const logoutHandler = (e) => {
		axios
			.post(
				"http://localhost:8000/api/users/logout",
				{},

				{ withCredentials: true }
			)

			.then((res) => {
				console.log(res);
				console.log(res.data);
				navigate("/");
			})

			.catch((err) => console.log(err));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		let location = { streetAddress: streetAddress + "" + zipcode };

		axios
			.put(
				"http://localhost:8000/api/events/" + id,
				{
					name,
					category,
					location,
					img,
					time,
					date,
					description,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				console.log(res);
				console.log(res.data);
				navigate("/events");
			})
			.catch((err) => {
				console.log(err);
				console.log("err.response:", err.response);
				console.log("err.response.data:", err.response.data);
				console.log("err.response.data.errors:", err.response.data.errors);
				setErrors(err.response.data.errors);
			});
	};
	//Resolved conflicts
	return (
		<div>
			<Navbar className="bg-light" expand="lg" fixed="top">
				<Container>
					<Navbar.Brand className="mx-5">My Eventbook</Navbar.Brand>

					<Navbar.Collapse className="d-flex justify-content-around">
						<Link to={"/all"} className="me-5">
							<button style={{ color: "gray", border: "none", background: "none" }}>Go to Homepage</button>
						</Link>

						<Link to={"/create"} className="me-5">
							<button style={{ color: "gray", border: "none", background: "none" }}>Host event</button>
						</Link>

						<Link to={"/events"} style={{ textDecoration: "none", color: "gray" }}>
							<button style={{ border: "none", color: "gray", background: "none" }} className="me-5">
								My events
							</button>
						</Link>

						<Link to={"/events"} className="me-5">
							<img
								style={{ height: "50px", width: "50px" }}
								src={
									"https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8="
								}
							></img>
						</Link>

						<button onClick={logoutHandler} style={{ color: "gray", border: "none", background: "none" }}>
							Logout
						</button>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<div style={{ height: "100px" }}></div>

			<Form onSubmit={submitHandler} className="w-50 mx-auto">
				<h1 className="mx-auto">Edit Event</h1>
				<Form.Group>
					<label>Event Name: </label>
					<Form.Control value={name} onChange={(e) => setName(e.target.value)} type="text" />
					<br />
					{errors.name ? <p>{errors.name.message}</p> : null}
					<br />
				</Form.Group>

				<Form.Group controlId="formBasicSelect">
					<Form.Select value={category} name="category" onChange={(e) => setCategory(e.target.value)}>
						<option defaultValue hidden>
							Select Category
						</option>
						<option value="Arts">Arts</option>
						<option value="Books">Books</option>
						<option value="Movies">Movies</option>
						<option value="Music">Music</option>
						<option value="Nature">Nature</option>
						<option value="Food">Food</option>
						<option value="Sports">Sports</option>
						<option value="Tiger Show">Tiger Show</option>
					</Form.Select>
					<br />
					{errors.category ? <p>{errors.category.message}</p> : null}
					<br />
				</Form.Group>

				<Form.Group>
					<label>Event Location: </label>
					<Form.Control value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} type="text" />
					<br />
					{errors.location ? <p>{errors.location.message}</p> : null}
					<br />
				</Form.Group>

				<Form.Group>
					{/* <label>Img:  </label> */}

					<FileBase64 type="file" multiple={false} onDone={({ base64 }) => setImg(base64)} />

					<br />
					{errors.img ? <p>{errors.img.message}</p> : null}
					<br />
				</Form.Group>

				<Form.Group>
					<label>Event Time: </label>
					<Form.Control value={time} onChange={(e) => setTime(e.target.value)} type="time" />
					<br />
					{errors.time ? <p>{errors.time.message}</p> : null}
					<br />
				</Form.Group>

				<Form.Group>
					<label>Event Date: </label>
					<Form.Control value={date} onChange={(e) => setDate(e.target.value)} type="date" />
					<br />
					{errors.date ? <p>{errors.date.message}</p> : null}
					<br />
				</Form.Group>

				<Form.Group>
					<label>Event Description: </label>
					<Form.Control value={description} onChange={(e) => setDescription(e.target.value)} type="text" />
					<br />
					{errors.description ? <p>{errors.description.message}</p> : null}
					<br />
				</Form.Group>

				<button className="btn btn-primary">Edit Event!</button>
			</Form>
		</div>
	);
};
export default EditEvent;