package alex.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import alex.model.MedicationPlan;

public interface MedicationPlanRepository extends JpaRepository<MedicationPlan, Integer> {

}
