import { Link } from "react-router-dom";
import icon from "../assets/icon.webp";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark custom-navbar px-4">
            <Link className="navbar-brand fw-bold fs-4" to="/">
                <img className="brand-logo me-2" src={icon} alt="Student Management" />
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
