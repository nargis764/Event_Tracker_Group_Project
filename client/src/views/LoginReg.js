import React from 'react'
import Login from "../components/Login"
import Register from "../components/Register"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";


const LoginReg = () => {
return (
    <div>
        <Row className="w-75 mx-auto mt-5">
            <Col sm={6}>
            {/* <Col  className="mt-5">    */}
                <Card className="w-75 mx-auto shadow p-3 bg-white rounded">
                    <Register/>
                </Card>
            
            </Col> 

            <Col sm={6}>
            {/* <Col className="mt-5"> */}
            <Card className="w-75 mx-auto shadow p-3 bg-white rounded">
                    <Login/>
                </Card>
            </Col>            
        </Row>
        
    </div>
)
}

export default LoginReg