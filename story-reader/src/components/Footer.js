import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';
import "../App.js";
import { Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <Col className='flex-column'>
            
            <MDBFooter bgColor='light' className='text-center text-lg-left'>
                <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    &copy; {new Date().getFullYear()} Data Representation and Querying: {'Fionn McCarthy'}
                </div>
            </MDBFooter>
        </Col>

    );
};

export default Footer;