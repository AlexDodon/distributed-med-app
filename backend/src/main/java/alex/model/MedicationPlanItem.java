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
public class MedicationPlanItem {
	@Override
	public String toString() {
		return "{\"id\":\"" + id + "\", \"ingestInterval\":\"" + ingestInterval + "\", \"ingestOffset\":\"" + ingestOffset
				+ "\", \"medications\":" + medications + "}";
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NonNull
	private Integer id;

	@Column
	private long ingestInterval;

	@Column
	private long ingestOffset;
	
	@ManyToMany(mappedBy="medicationPlanItems")
	private List<MedicationPlan> medicationPlans = null;
	@JsonIgnore 
	@ManyToMany
	private List<Medication> medications = null;
}
