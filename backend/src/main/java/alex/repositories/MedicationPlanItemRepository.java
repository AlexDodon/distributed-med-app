package alex.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import alex.model.MedicationPlanItem;

public interface MedicationPlanItemRepository extends JpaRepository<MedicationPlanItem, Integer> {

}
