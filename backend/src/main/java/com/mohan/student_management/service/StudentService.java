package com.mohan.student_management.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.mohan.student_management.entity.Student;
import com.mohan.student_management.repository.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> viewStudents() {
        return studentRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Student searchStudent(int id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student updateStudent(int id, Student newStudent) {
        Student oldStudent = studentRepository.findById(id).orElse(null);

        if (oldStudent == null) {
            return null;
        }

        oldStudent.setName(newStudent.getName());
        oldStudent.setAge(newStudent.getAge());
        oldStudent.setCourse(newStudent.getCourse());

        return studentRepository.save(oldStudent);

    }

    public boolean deleteStudent(int id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
