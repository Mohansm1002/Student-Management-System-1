import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar px-4">
            <Link className="navbar-brand fw-bold fs-4" to="/">
                <i className="bi bi-mortarboard-fill me-2"></i>
                Student Management
            </Link>

            <div className="ms-auto">
                <Link className="btn btn-light btn-sm me-2" to="/">
                    <i className="bi bi-house-door-fill me-1"></i>
                    Home
                </Link>

                <Link className="btn btn-warning btn-sm" to="/add">
                    <i className="bi bi-plus-circle-fill me-1"></i>
                    Add Student
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;