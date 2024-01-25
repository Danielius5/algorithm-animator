import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export function MainNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/algorithm-animator">Finite State Automaton Animator</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Maybe possible to fix this? ugly... */}
            <Nav.Link to="/dfa-from-ui" as={Link} onClick={() => {if (window.location.href.endsWith("ui")) window.location.reload()}}>Build From UI</Nav.Link>
            <Nav.Link to="/dfa-from-regex" as={Link} onClick={() => {if (window.location.href.endsWith("regex")) window.location.reload()}} >Build From RegEx</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}