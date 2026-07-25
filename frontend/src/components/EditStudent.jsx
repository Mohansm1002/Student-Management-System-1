import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById, updateStudent } from "../services/StudentService";

function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState({
        id: "",
        name: "",
        age: "",
        course: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadStudent = async () => {
            try {
                const response = await getStudentById(id);

                if (!response.data) {
                    setError("Student not found.");
                    return;
                }

                setStudent(response.data);
            } catch (err) {
                console.log("Error loading student:", err);
                setError("Unable to load student details.");
            } finally {
                setLoading(false);
            }
        };

        loadStudent();
    }, [id]);

    const handleChange = (e) => {
        setStudent({
            ...student,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await updateStudent(id, student);
            navigate("/");
        } catch (err) {
            console.log("Error updating student:", err);
            setError("Unable to update student. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="form-card mx-auto text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mb-0 text-muted">Loading student details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="form-card mx-auto">
                <h2 className="text-center mb-4">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Student
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label className="form-label">Student ID</label>
                    <input
                        type="number"
                        name="id"
                        className="form-control mb-3"
                        value={student.id}
                        disabled
                        readOnly
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

                    <button className="btn btn-warning w-100 mb-2" disabled={saving || !!error}>
                        <i className="bi bi-save-fill me-1"></i>
                        {saving ? "Updating..." : "Update Student"}
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

export default EditStudent;
