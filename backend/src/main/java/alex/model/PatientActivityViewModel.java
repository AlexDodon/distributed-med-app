package alex.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode
public class PatientActivityViewModel implements Serializable{
	private static final long serialVersionUID = 1L;

	private Integer patientId;
	
	private String activity;
	
	private long start;
	
	private long ending;
	
	public PatientActivityViewModel(
		@JsonProperty("patient_id") Integer patientId,
		@JsonProperty("activity") String activity,
		@JsonProperty("start") long start,
		@JsonProperty("end") long ending
	) {
		this.patientId = patientId;
		this.activity = activity;
		this.start = start;
		this.ending = ending;
	}
}
