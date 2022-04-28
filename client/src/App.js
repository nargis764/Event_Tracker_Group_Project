import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyEvents from "./components/MyEvents";
import AllEvents from "./components/AllEvents";
import CreateEvent from "./components/CreateEvent";
import EditEvent from "./components/EditEvent";
import LoginReg from "./views/LoginReg"
import GoogleMaps from "./components/GoogleMaps";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (props) => {
	const [events, setEvents] = useState([]);
	return (
		<>
			<BrowserRouter>
				<div>
					<Routes>
						<Route path="/" element={<LoginReg />} />
						<Route path="/all" element={<AllEvents events={events} setEvents={setEvents} />} />
						<Route path="/maps" element={<GoogleMaps />} />
						<Route path="/events" element={<MyEvents />} />
						<Route path="/events/:id" element={<EditEvent />} />
						<Route path="/create" element={<CreateEvent />} />
					</Routes>
				</div>
			</BrowserRouter>
		</>
	);
};

export default App;