import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../services/StudentService";

function AddStudent() {
    const navigate = useNavigate();

    const [student, setStudent] = useState({
        id: "",
        name: "",
        age: "",
        course: "",
    });

    const handleChange = (e) => {
        setStudent({
            ...student,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await addStudent(student);
        navigate("/");
    };

    return (
        <div className="container mt-5">
            <div className="form-card mx-auto">
                <h2 className="text-center mb-4">
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Add Student
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className="form-label">Student ID</label>
                    <input
                        type="number"
                        name="id"
                        className="form-control mb-3"
                        placeholder="Enter student ID"
                        value={student.id}
                        onChange={handleChange}
                        required
                    />

                    <label className="form-label">Student Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control mb-3"
                        placeholder="Enter student name"
                        value={student.name}
                        onChange={handleChange}
                        required
                    />

                    <label className="form-label">Age</label>
                    <input
                        type="number"
                        name="age"
                        className="form-control mb-3"
                        placeholder="Enter age"
                        value={student.age}
                        onChange={handleChange}
                        required
                    />

                    <label className="form-label">Course</label>
                    <input
                        type="text"
                        name="course"
                        className="form-control mb-4"
                        placeholder="Enter course"
                        value={student.course}
                        onChange={handleChange}
                        required
                    />

                    <button className="btn btn-success w-100 mb-2">
                        <i className="bi bi-save-fill me-1"></i>
                        Save Student
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary w-100"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddStudent;