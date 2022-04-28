import React from 'react'
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";



const SearchForm = (props) => {
    
const {handleSubmit, setSearchDate, setSearchCategory, setSearchZipCode} = props;   

return (
    <div>
        <Form className=" mt-4" onSubmit={handleSubmit}>
					<Container>
						<Row>
							<Col>
								<Form.Group controlId="formBasicSelect" className="mt-4">
									{/* <Form.Label>Pick a Date</Form.Label> */}
									<Form.Control 
                                    type="date" 
                                    name="date"
                                    placeholder="Pick a date" 
                                    onChange={(e) => setSearchDate(e.target.value)} />
								</Form.Group>
							</Col>

							<Col>
								{/* <Card className="w-50 mt-4"> */}
								<Form.Group controlId="formBasicSelect" className="mt-4">
									<Form.Select 
                                    aria-label="Default select example" 
                                    onChange={(e) => setSearchCategory(e.target.value)}>
										<option>Select a category</option>
										<option value="Arts">Arts</option>
										<option value="Books">Books</option>
										<option value="Movie">Movie</option>
										<option value="Music">Music</option>
										<option value="Nature">Nature</option>
										<option value="Food">Food</option>
										<option value="Sports">Sports</option>
									</Form.Select>
								</Form.Group>
								{/* </Card> */}
							</Col>

							<Col>
								<Form.Group controlId="formBasicSelect" className=" mt-4">
									<Form.Control
										aria-label="Default select example"
										type="search"
										placeholder="Enter a Zipcode"
										onChange={(e) => setSearchZipCode(e.target.value)}
									></Form.Control>
								</Form.Group>
							</Col>

							<Col>
								<Form.Group className=" mt-4">
									<button className="btn btn-secondary">Submit</button>
								</Form.Group>
							</Col>
						</Row>
					</Container>
				</Form>
    </div>
)
}

export default SearchForm