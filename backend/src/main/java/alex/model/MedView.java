package alex.model;

import javax.persistence.Entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
public class MedView {
	private Integer id;

	private String name;
	
	private String sideEffects;
	
	private String dosage;
}
