package alex.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode
public class MedicationPlan {
	@Override
	public String toString() {
		return "{\"id\":\"" + id + "\", \"medicationPlanItems\":" + medicationPlanItems + ", \"name\":\"" + name
				+ "\", \"treatmentStart\":\"" + treatmentStart + "\", \"treatmentEnd\":\"" + treatmentEnd + "}";
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NonNull
	private Integer id;
	@JsonIgnore 
	@ManyToMany
	private List<MedicationPlanItem> medicationPlanItems = null;
	
	@ManyToMany(mappedBy = "medicationPlans")
	private List<Patient> patients = null;
	
	@Column
	private String name;

	@Column
	private long treatmentStart;
	
	@Column
	private long treatmentEnd;
}
