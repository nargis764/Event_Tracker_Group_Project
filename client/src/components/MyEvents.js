import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//import NavbarComponent from "./NavbarComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// things that can become component files from this file alone: Card.js NavBar.js

const MyEvents = (props) => {
	const { logout } = useContext(UserContext);
	const [myEvents, setMyEvents] = useState([]);
	const [eventDetails, setEventDetails] = useState([]);
	const [show, setShow] = useState(false);
	const [eventClickedId, setEventClickedId] = useState(null);
	const [deleted, setDeleted] = useState(false);
	const [interests, setInterests] = useState([]);
	const [interestList, setInterestList] = useState([]);
	const [mounted, setMounted] = useState(false);
	let id = null;
	const navigate = useNavigate();

	useEffect(() => {
		axios
			.get(`http://localhost:8000/api/interests`, {
				withCredentials: true,
			})
			.then((res) => {
				setInterests(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
		axios
			.get(`http://localhost:8000/api/users/`, { withCredentials: true })
			.then((res) => {
				// console.log(res.data._id);
				id = res.data._id;
				axios
					.get(`http://localhost:8000/api/events/user/${id}`)
					.then((res) => setMyEvents(res.data))
					.catch((err) => console.error(err));
			})
			.catch((err) => console.log(err));
	}, []);

	

	useEffect(() => {
		if (!!interests[0]) {
			console.log(interests[0]);
			interests.map((interest, index) => {
				if (interest.going === true || interest.interested === true) {
					let thisEvent = interest.event._id;
					axios
						.get(`http://localhost:8000/api/events/${thisEvent}`)
						.then((res) => {
							//console.log(res.data);
							setInterestList([...interestList, res.data[0]]);
						})
						.catch((err) => {
							console.log(err);
						});
				}
			});
			setMounted(true);
		}
	}, [interests]);

	// when event clicked...

	const handleClick = (e, name, location, eventDescription, img, id) => {
		e.preventDefault();
		setEventDetails({ name: name, location: location, eventDescription: eventDescription, img: img });
		setEventClickedId(id);
	};

	const handleEventButton = (e) => {
		e.preventDefault();
		setShow(!show);
	};

	// handle login.
	const logoutHandler = (e) => {
		axios
			.post(
				"http://localhost:8000/api/users/logout",
				{},

				{ withCredentials: true }
			)

			.then((res) => {
				logout();
				console.log(res);
				console.log(res.data);
				navigate("/");
			})

			.catch((err) => console.log(err));
	};

	const onDeleteHandler = async (e, eventId) => {
		console.log(eventId);
		setDeleted(eventId);
		axios
			.delete("http://localhost:8000/api/events/" + eventId, { withCredentials: true })
			.then((res) => {
				console.log(res);
				setMyEvents(myEvents.filter((evnt) => evnt._id !== deleted));
			})
			.catch((err) => console.log(err));
	};

	// map through events and use interest.rout as user related events. use events.getAllInterests
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
			{/* <NavbarComponent logoutHandler={logoutHandler} handleEventButton={handleEventButton} /> */}

			<div style={{ height: "50px" }}></div>

			{/* search results */}
			<div style={{ height: "30px" }}></div>

			{/* below is the listings of the events */}
			<div className="d-flex justify-content-between w-75 mx-auto">
				<Container>
					<Row>
					<h1> My Hosted Events</h1>
						<Col style={{ height: "130vh", overflowY: "scroll" }}>
							<Card className="mt-20 shadow p-3 mb-5 mx-auto bg-white rounded">
								{
									// set up interests for mapping here
									myEvents.map((event, index) => {
										return (
											<Card
												key={index}
												className="mb-5 p-3"
												style={
													eventClickedId === event.id
														? { border: "blue", borderRadius: "5px 5px 5px 5px", background: "gray" }
														: { borderRadius: "5px 5px 5px 5px" }
												}
											>
												<Row>
													<Col sm={6}>
														<Card.Img src={event.img}></Card.Img>
													</Col>

													<Col sm={6}>
														<Card.Title className="event-name">
															<h1
																onClick={(e) => {
																	handleClick(
																		e,
																		event.name,
																		event.location.streetAddress,
																		event.description,
																		event.img,

																		event.id
																	);
																}}
															>
																{event.name}
															</h1>
														</Card.Title>
														<Card.Title>{event.location.streetAddress}</Card.Title>

														<Card.Title>{event.category}</Card.Title>
														<Card.Text>{event.description.substring(0, 100)} .....</Card.Text>
														{/* buttons for edit and delete. */}
														<Link to={`/events/${event._id}`}>
															<button> edit event</button>
														</Link>
														<button onClick={(e) => onDeleteHandler(e, event._id)}>Delete</button>
													</Col>
												</Row>
											</Card>
										);
									})
								}
							</Card>
						</Col>

						<Col>
						<h1> Events I'm Attending</h1>
							<Card className="mt-20 shadow p-3 mb-5 mx-auto bg-white rounded">
								{/* <Card className="mb-5">
									<Row>
										<Col>
											<Card.Img src={eventDetails.img}></Card.Img>
										</Col>
										<Col>
											<Card.Text>{eventDetails.name}</Card.Text>
											<Card.Text>{eventDetails.location}</Card.Text>
										</Col>
									</Row>
								</Card> */}

								{/* <Card className="mb-5">
                    <Card.Img 
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxFlMBcV79owv9LG8m93RFJ13FghwopNWLfw&usqp=CAU"}></Card.Img>
    
                </Card> */}

								{mounted &&
									interestList.map((int, indx) => {
										console.log(int);
										return (
											<Card key={indx}>
												<Card.Title>{int.name}</Card.Title>
												<Card.Text>{int.time}</Card.Text>
												<Card.Text>{int.date}</Card.Text>
												<Card.Text>{int.location.streetAddress}</Card.Text>
											</Card>
										);
									})}
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
			{/* <input type="search" onChange={(e) => handleSearch(e.target.value)}/>
            <h1>{filteredName}</h1> */}
		</div>
	);
};

export default MyEvents;