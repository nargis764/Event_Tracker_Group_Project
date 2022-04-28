import React, { useContext, useState, useEffect, useMemo } from "react";
import Navbar from "react-bootstrap/Navbar";
//import GoogleMaps from "./GoogleMaps";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import NavComponent from "./NavComponent";
import SearchForm from "./SearchForm";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";



const AllEvents = ({ events, setEvents }) => {
	const { logout } = useContext(UserContext);
	const [eventDetails, setEventDetails] = useState([]);
	const [show, setShow] = useState(false);
	const [eventClickedId, setEventClickedId] = useState(null);
	const [interest, setInterest] = useState({ going: false, interested: false });
	const [searchZipCode, setSearchZipCode] = useState("");
	const [searchCategory, setSearchCategory] = useState("");
	const [searchDate, setSearchDate] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [queryFound, setQueryFound] = useState(false);


	// setting up the center position for google map
	const center = useMemo(() => ({ lat: 47.85, lng: -122.14 }), []);
	const [selected, setSelected] = useState(center);

	const navigate = useNavigate();



	//Fetching all the events
	useEffect(() => {
		axios
			.get("http://localhost:8000/api/events")
			.then((res) => {
				setEvents(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	});



// Checkbox functionality for interested/going

	const handleCheck = (e, id) => {
		console.log(id);
		e.target.name === "going" ? handleGoing(id) : handleInterested(id);
		axios
			.post(`http://localhost:8000/api/events/${id}/interests/create`, interest, { withCredentials: true })
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleGoing = (id) => {
		console.log("handleGoing");
		setInterest({ going: !interest.going, interested: false });
	};
	const handleInterested = (id) => {
		console.log("handleInterested");
		setInterest({ interested: !interest.interested, going: false });
	};




	// function to handle searching by multiple fields
	const handleSubmit = (e) => {
		e.preventDefault();
		const result = events.filter((event, i) => {
			return event.zipcode === searchZipCode && event.eventType === searchCategory && event.date === searchDate;
		});
		console.log(result);
		setSearchResult(result);
		setQueryFound(true);
	};

	// function to show/hide search bar
	const handleEventButton = (e) => {
		e.preventDefault();
		setShow(!show);
	};




	const handleClick = (e, name, description, img, id) => {
		e.preventDefault();
		setEventDetails({ name: name, description: description, img: img });
		setEventClickedId(id);
	};



//Setting up longitude/latitude based upon the clicked location
	const handleSelectLocation = (e, location, idFromClickedLocation) => {
		e.preventDefault();
		console.log(location);
		//setClickedLocation(location)

		getGeocode({ address: location })
			.then((res) => {
				console.log(res);
				getLatLng(res[0]).then(({ lat, lng }) => {
					console.log({ lat, lng });
					setSelected({ lat, lng });
				});
			})
			.catch((err) => {
				console.log("Something went wrong retrieving the data.");
				console.log(err);
			});
	};





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

	return (
		<div>
			<NavComponent logoutHandler={logoutHandler} handleEventButton={handleEventButton}/>


			<div style={{ height: "50px" }}></div>

			{/* show the forms only when "find my events" are clicked */}
			{/* they are hidden otherwise */}
			{show && (
				<SearchForm
				handleSubmit={handleSubmit}
				setSearchDate={setSearchDate}
				setSearchCategory={setSearchCategory}
				setSearchZipCode={setSearchZipCode}
				/>

			)}

			<div style={{ height: "30px" }}></div>



			<div className="d-flex justify-content-between w-75 mx-auto">
				<Container>
					<Row>
						<Col style={{ height: "130vh", overflowY: "scroll" }} sm={6}>
							<Card className="mt-20 shadow p-3 mb-5 mx-auto bg-white rounded">
								{queryFound
									? searchResult.map((event, index) => {
											return (
												<Card
													key={index}
													className="mb-5 p-3 border-primary"
													style={
														eventClickedId === event._id
															? { border: "blue", borderRadius: "5px 5px 5px 5px", background: "gray" }
															: { borderRadius: "5px 5px 5px 5px" }
													}
												>
													<Row>
														<Col sm={6}>
															<Card.Img src={event.img}></Card.Img>
															<Card.Text> Host: {event.createdBy.name}</Card.Text>

															<Card.Text>Date: {event.date}</Card.Text>
														</Col>

														<Col sm={6}>
															<Card.Title
																	onClick={(e) => {
																		handleClick(
																			e,
																			event.name,
																			// event.location.streetAddress,
																			event.description,
																			event.img,
																			// event.createdBy.name,
																			event._id
																		);
																	}}
																>
																	{event.name}

															</Card.Title>

															<Card.Text style={{ color: "gray" }}># {event.category}</Card.Text>

															{/* <Card.Text onClick={(e) => {handleSelect(event.location)}}>{event.location}-{event.zipcode}</Card.Text>  */}
															<Card.Text
																onClick={(e) => handleSelectLocation(e, event.location.streetAddress, event._id)}
															>
																{event.location.streetAddress}
															</Card.Text>


															<Card.Text>
																{event.eventDescription.substring(0, 100)}
																..... <span style={{ color: "blue" }}>details</span>
															</Card.Text>
														</Col>
													</Row>

													<Row>


														<Form className="mx-auto mt-4 d-flex p-2">
															<Form.Group>
																<Form.Check
																	type="checkbox"
																	label="Interested"
																	inline
																	checked={event.interested}
																	onChange={(e) => handleCheck(e, event._id)}
																/>
															</Form.Group>

															<Form.Group>
																<Form.Check
																	type="checkbox"
																	label="Going"
																	inline
																	checked={event.going}
																	onChange={(e) => handleCheck(e, event._id)}
																/>
															</Form.Group>
														</Form>
													</Row>
												</Card>
											);
									})
									: events.map((event, index) => {
											return (
												<Card
													key={index}
													className="mb-5 p-3 shadow"
													style={
														eventClickedId === event._id
															? { borderRadius: "5px 5px 5px 5px", background: "lightgray" }
															: { borderRadius: "5px 5px 5px 5px" }
													}
												>
													<Row>
														<Col sm={6}>
															<Card.Img src={event.img || null}></Card.Img>
															<Card.Text> Host: {event.createdBy.name}</Card.Text>
															<Card.Text>Date: {event.date}</Card.Text>
														</Col>

														<Col sm={6}>
															<h2
															onClick={(e) => {
																		handleClick(
																			e,
																			event.name,
																			// event.location.streetAddress,
																			event.description,
																			event.img,
																			// event.createdBy.name,
																			event._id
																		);
																	}}>
															{event.name}

															</h2>

															<Card.Text># {event.category}</Card.Text>
															{/* <Card.Text onClick={(e) => {handleSelect(event.location)}}>{event.location}-{event.zipcode}</Card.Text>  */}
															<Card.Text
																onClick={(e) => handleSelectLocation(e, event.location.streetAddress, event._id)}
															>
																{event.location.streetAddress}
															</Card.Text>

															

															<Card.Text>
																{event.description.substring(0, 100)}
																..... <span style={{ color: "blue" }}>details</span>
															</Card.Text>
														</Col>
													</Row>

													<Row>

														<Form className="mx-auto mt-4 d-flex p-2">
															<Form.Group>
																<Form.Check
																	type="checkbox"
																	label="Interested"
																	inline
																	name="interested"
																	checked={interest.interested}
																	onChange={(e) => handleCheck(e, event._id)}
																/>
															</Form.Group>

															<Form.Group>
																<Form.Check
																	type="checkbox"
																	label="Going"
																	inline
																	name="going"
																	checked={interest.going}
																	onChange={(e) => handleCheck(e, event._id)}
																/>
															</Form.Group>
														</Form>
													</Row>
												</Card>
											);
									})}
							</Card>
						</Col>

						<Col sm={6}>
							<Card className="mt-20 shadow p-3 mb-5 mx-auto bg-white rounded">
								{eventClickedId ? (
									<Card className="mb-5">
										<Row>
											<Col>
												<Card.Img src={eventDetails?.img}></Card.Img>
											</Col>
											<Col>
												<Row>
													<Card.Title>{eventDetails?.name}</Card.Title>
													{/* <Card.Text>{eventDetails?.location.streetAddress}</Card.Text> */}
												</Row>

												{/* <Row>
													<Card.Text>{eventDetails?.createdBy.name}</Card.Text>
												</Row> */}
											</Col>
										</Row>
									</Card>
								) : (
									// Loads the information of latest event when no event is selected
									<Card className="mb-5">
										<Row>
											<Col>
												<Card.Img src={events[0]?.img}></Card.Img>
											</Col>
											<Col>
												<Row>
													<Card.Title>{events[0]?.name}</Card.Title>
													{/* <Card.Text>{events[0]?.location.streetAddress}</Card.Text> */}
												</Row>
												<Row>
													<Card.Text>{events[0]?.hostedBy}</Card.Text>
												</Row>
											</Col>
										</Row>
									</Card>
								)}

								<Card className="mb-5">
									{/* <GoogleMaps selected={selected} /> */}
								</Card>

								{eventClickedId ? (
									<Card>
										<Card.Text className="p-3">{eventDetails.description}</Card.Text>
									</Card>
								) : (
									// Loads the information of latest event by default when no event is selected
									<Card>
										<Card.Text className="p-3">{events[0]?.description}</Card.Text>
									</Card>
								)}
							</Card>
						</Col>
					</Row>
				</Container>
			</div>

		</div>
	);
};

export default AllEvents;