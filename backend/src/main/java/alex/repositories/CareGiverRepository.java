package alex.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import alex.model.CareGiver;

public interface CareGiverRepository extends JpaRepository<CareGiver, Integer> {

}
