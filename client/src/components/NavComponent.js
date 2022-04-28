import React from 'react'
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

const NavComponent = (props) => {

	const {handleEventButton, logoutHandler} = props;


return (
    <div>
        <Navbar className="bg-light" expand="lg" fixed="top">
				<Container>
					<Navbar.Brand className="mx-5">My Eventbook</Navbar.Brand>

					<Navbar.Collapse className="d-flex justify-content-around">
						<Link to={"/"} className="me-5">
							<button onClick={(e) => handleEventButton(e)} style={{ color: "gray", border: "none", background: "none" }}>
								Find events near me
							</button>
						</Link>

						<Link to={"/create"} className="me-5">
							<button style={{ color: "gray", border: "none", background: "none" }}>Host event</button>
						</Link>

						<Link to={"/events"} style={{ textDecoration: "none", color: "gray" }}>
							<button style={{ border: "none", color: "gray", background: "none" }} className="me-5">
								My events
							</button>
						</Link>

						<Link to={"/"} className="me-5">
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
    </div>
)
}

export default NavComponent