package alex.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
public class PatientActivity {
	@Id
	@GeneratedValue(strategy = GenerationType.TABLE)
	@NonNull
	private Integer id;
	
	@Column
	private String activity;
	
	@Column
	private long start;
	
	@Column
	private long ending;
	
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="patients_id")
	private Patient patient = null;
}
