package alex.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
public class Patient extends User {  
	@Column
	private String medicalRecord;
	@JsonIgnore  
	@ManyToMany
	private List<MedicationPlan> medicationPlans = null;
	
	@ManyToMany(mappedBy = "patients")
	private List<CareGiver> careGivers = null;

	@OneToMany(
            mappedBy = "patient",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
	private List<PatientActivity> patientActivity = null;
}
