package alex.repositories;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import alex.model.PatientActivity;

@Transactional
public interface PatientActivityRepository extends JpaRepository<PatientActivity, Integer> {

}
