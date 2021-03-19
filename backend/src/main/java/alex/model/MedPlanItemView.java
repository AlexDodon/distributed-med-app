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
public class MedPlanItemView {
	private Integer id;

	private long ingestInterval;

	private long ingestOffset;
	
	private List<MedView> medications = null;
}
