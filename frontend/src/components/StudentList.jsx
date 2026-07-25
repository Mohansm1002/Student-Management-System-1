import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteStudent, getStudents } from "../services/StudentService";

function StudentList() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");

    const loadStudents = async () => {
        try {
            const response = await getStudents();
            setStudents(response.data);
        } catch (error) {
            console.log("Error loading students:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");

        if (confirmDelete) {
            await deleteStudent(id);
            loadStudents();
        }
    };

    useEffect(() => {
        const loadInitialStudents = async () => {
            try {
                const response = await getStudents();
                setStudents(response.data);
            } catch (error) {
                console.log("Error loading students:", error);
            }
        };

        loadInitialStudents();
    }, []);

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.course.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <div className="hero-card mb-4">
                <h1>Student Dashboard</h1>
                <p>Manage student records with Spring Boot, React and PostgreSQL</p>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="stats-card">
                        <i className="bi bi-people-fill"></i>
                        <div>
                            <h6>Total Students</h6>
                            <h2>{students.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stats-card">
                        <i className="bi bi-book-fill"></i>
                        <div>
                            <h6>Courses</h6>
                            <h2>{new Set(students.map((s) => s.course)).size}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="stats-card">
                        <i className="bi bi-database-fill-check"></i>
                        <div>
                            <h6>Database</h6>
                            <h2>PostgreSQL</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="fw-bold">Student List</h3>

                    <Link to="/add" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-1"></i>
                        Add Student
                    </Link>
                </div>

                <input
                    type="text"
                    className="form-control mb-3 search-box"
                    placeholder="Search by name or course..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Course</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td className="fw-semibold">{student.name}</td>
                                        <td>{student.age}</td>
                                        <td>
                                            <span className="badge bg-primary">
                                                {student.course}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <Link
                                                to={`/edit/${student.id}`}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(student.id)}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StudentList;
