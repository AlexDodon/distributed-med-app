package alex;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import alex.model.CareGiver;
import alex.model.Doctor;
import alex.model.Patient;
import alex.repositories.UserRepository;

@Service
public class loginsInit implements CommandLineRunner {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public loginsInit(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
	@Override
	public void run(String... args) throws Exception {        
        if (this.userRepository.findByUsername("doc") == null) {
        	Doctor doc = new Doctor();
        	doc.setName("Doc");
        	doc.setPassword(passwordEncoder.encode("qwe"));
        	doc.setUsername("doc");
        	doc.setAddress("home");
        	doc.setBirthDate("today");
        	doc.setRoles("DOCTOR");
        	doc.setPermissions("");
        	doc.setGender("doc");

        	this.userRepository.save(doc);
        }
        
        if (this.userRepository.findByUsername("pat") == null) {
        	Patient pat = new Patient();
        	pat.setName("Pat");
        	pat.setPassword(passwordEncoder.encode("qwe"));
        	pat.setUsername("pat");
        	pat.setAddress("address");
        	pat.setBirthDate("yesterday");
        	pat.setRoles("PATIENT");
        	pat.setPermissions("");
        	pat.setMedicalRecord("sick, alright");
        	pat.setGender("pat");
        	
        	this.userRepository.save(pat);
        }
        
        if (this.userRepository.findByUsername("caren") == null) {
        	CareGiver caren = new CareGiver();
        	caren.setName("Caren");
        	caren.setPassword(passwordEncoder.encode("qwe"));
        	caren.setUsername("caren");
        	caren.setAddress("street");
        	caren.setBirthDate("last week");
        	caren.setRoles("CAREGIVER");
        	caren.setPermissions("");
        	caren.setGender("Karen");
        	
        	this.userRepository.save(caren);
        }
	}

}
