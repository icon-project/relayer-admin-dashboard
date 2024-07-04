import { Container } from 'react-bootstrap'

export default function Footer() {
  return (
    <footer className="footer border-top px-sm-2 py-2">
      <Container fluid className="text-center align-items-center flex-column flex-md-row d-flex justify-content-between">
        <div>
          <a className="text-decoration-none" href="https://github.com/icon-project/cetralized-relay">Centralized Relay </a>
          {' '}
          © 2024
          Icon Foundation.
        </div>
        <div className="ms-md-auto">
          Powered by&nbsp;
          <a
            className="text-decoration-none"
            href="https://venture23.xyz"
          >
            Venture23
          </a>
        </div>
      </Container>
    </footer>
  )
}
