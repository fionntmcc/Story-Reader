import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Card } from 'react-bootstrap';

// uses the Navbar component from react-bootstrap to create a navigation bar
const NavigationBar = () => {
  return (
        <Navbar bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="/">StoryReader</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/browse">Browse</Nav.Link>
              <Nav.Link href="/write">Write</Nav.Link>
            </Nav>
          </Container>
      </Navbar>
  );
};

export default NavigationBar;