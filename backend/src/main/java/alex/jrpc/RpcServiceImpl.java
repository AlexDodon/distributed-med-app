package alex.jrpc;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.googlecode.jsonrpc4j.spring.AutoJsonRpcServiceImpl;

import alex.model.MedPlanItemView;
import alex.model.MedPlanView;
import alex.model.MedView;
import alex.model.Medication;
import alex.model.Patient;
import alex.repositories.MedicationRepository;
import alex.repositories.PatientRepository;

@Service
@AutoJsonRpcServiceImpl
public class RpcServiceImpl implements RpcService {

	@Autowired
	PatientRepository pr;
	
	@Autowired
	MedicationRepository mr;
	
	@Transactional
	@Override
	public List<MedPlanView> getMedicationPlans(Integer patientId) throws Exception {
		Patient p = pr.findById(patientId).get();
		
		List<MedPlanView> res = new ArrayList<MedPlanView>();
		
		p.getMedicationPlans().forEach(mp -> {
			MedPlanView x = new MedPlanView();
			x.setId(mp.getId());
			x.setName(mp.getName());
			x.setTreatmentEnd(mp.getTreatmentEnd());
			x.setTreatmentStart(mp.getTreatmentStart());
			
			List<MedPlanItemView> resa = new ArrayList<MedPlanItemView>();
		
			mp.getMedicationPlanItems().forEach(mpi -> {
				MedPlanItemView y = new MedPlanItemView();
				y.setId(mpi.getId());
				y.setIngestInterval(mpi.getIngestInterval());
				y.setIngestOffset(mpi.getIngestOffset());
				
				List<MedView> resb = new ArrayList<MedView>();
			
				mpi.getMedications().forEach(m -> {
					MedView z = new MedView();
					z.setId(m.getId());
					z.setDosage(m.getDosage());
					z.setName(m.getName());
					z.setSideEffects(m.getSideEffects());
					resb.add(z);
				});
				
				y.setMedications(resb);
				resa.add(y);
			});
			
			x.setMedicationPlanItems(resa);
			res.add(x);
		});
		
		return res;
	}

	@Transactional
	@Override
	public String medicationTaken(Integer patientId, Integer medicationId) throws Exception {
		Patient p = pr.findById(patientId).get();
		Medication medication = mr.findById(medicationId).get();
		
		System.out.println("Patient " + p.getName() + " took the medication " + medication.getName());
		
		return "It did print. You did good.";
	}

	@Transactional
	@Override
	public String medicationNotTaken(Integer patientId, Integer medicationId) throws Exception {
		Patient p = pr.findById(patientId).get();
		Medication medication = mr.findById(medicationId).get();
		
		System.out.println("Patient " + p.getName() + " did not take the medication " + medication.getName());
		
		return "It did print. You did good.";
	}

}
