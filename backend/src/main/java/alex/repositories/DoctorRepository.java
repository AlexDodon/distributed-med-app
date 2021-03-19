package alex.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import alex.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

}
