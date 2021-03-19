package alex.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import alex.model.Medication;


public interface MedicationRepository extends JpaRepository<Medication, Integer> {

}
