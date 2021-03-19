package alex.jrpc;

import java.util.List;

import com.googlecode.jsonrpc4j.JsonRpcService;

import alex.model.MedPlanView;
import alex.model.Medication;
import alex.model.MedicationPlan;

@JsonRpcService("/rpc")
public interface RpcService {
	
	public List<MedPlanView> getMedicationPlans(Integer patientId) throws Exception;
	public String medicationTaken(Integer patientId, Integer medicationId) throws Exception;
	public String medicationNotTaken(Integer patientId, Integer medicationId) throws Exception;
}
