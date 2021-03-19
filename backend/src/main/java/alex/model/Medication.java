package alex.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;


@Entity
@Getter
@Setter
@EqualsAndHashCode
public class Medication   {
	@Override
	public String toString() {
		return "{\"id\":\"" + id + "\", \"name\":\"" + name + "\", \"sideEffects\":\"" + sideEffects + "\", \"dosage\":\"" + dosage + "\"}";
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NonNull
	private Integer id;

	@Column
	private String name;
	
	@Column
	private String sideEffects;
	
	@Column
	private String dosage;
  
	@ManyToMany(mappedBy="medications")
	private List<MedicationPlanItem> medicationPlanItems = null;
}

