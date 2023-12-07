import { Container, Nav, Navbar } from "react-bootstrap";

export function MainNavbar() {
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Finite State Automaton Animator</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/algorithm-animator/dfa-from-ui">Build From UI</Nav.Link>
              <Nav.Link href="/algorithm-animator/dfa-from-regex">Build From RegEx</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }