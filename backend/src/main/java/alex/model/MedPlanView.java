package alex.model;

import java.util.List;

import javax.persistence.Entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
public class MedPlanView {
	private Integer id;

	private List<MedPlanItemView> medicationPlanItems = null;
	
	private String name;

	private long treatmentStart;
	
	private long treatmentEnd;
}
