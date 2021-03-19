package alex.repositories;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import alex.model.Patient;

@Transactional
public interface PatientRepository extends JpaRepository<Patient, Integer> {

}
