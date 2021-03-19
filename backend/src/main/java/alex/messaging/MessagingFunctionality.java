package alex.messaging;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import javax.transaction.Transactional;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarables;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import alex.model.Patient;
import alex.model.PatientActivity;
import alex.model.PatientActivityViewModel;
import alex.repositories.PatientActivityRepository;
import alex.repositories.PatientRepository;

@Configuration
@Transactional
public class MessagingFunctionality {
	public static final String EXCHANGE_NAME = "patientSensorData";
	public static final String QUEUE_NAME = "backend";

	@Autowired
	PatientRepository pr;
	
	@Autowired
	PatientActivityRepository par;
	
	@Bean
	public Declarables fanoutBindings() {
	    Queue fanoutQueue = new Queue(QUEUE_NAME, false, true, true);
	    FanoutExchange fanoutExchange = new FanoutExchange(EXCHANGE_NAME,false, false);
	 
	    return new Declarables(
	      fanoutQueue,
	      fanoutExchange,
	      BindingBuilder.bind(fanoutQueue).to(fanoutExchange));
	}
	
	@RabbitListener(queues = QUEUE_NAME)
	public void receivePatientActivity(PatientActivityViewModel message) throws InterruptedException, NoSuchElementException {
		PatientActivity pa = new PatientActivity();
		pa.setActivity(message.getActivity());
		pa.setEnding(message.getEnding());
		pa.setStart(message.getStart());
		
		Optional<Patient> maybePatient = pr.findById(message.getPatientId());
		Patient pat = maybePatient.get();
		
		pa = par.save(pa);
		
		pa.setPatient(pat);
		
		par.save(pa);
		
		switch (pa.getActivity()) {
			case "Sleeping":
				System.out.println("Sleeping "+ pa.getStart() + " | " + pa.getEnding());
				if (pa.getEnding() - pa.getStart() > 7*60*60) {
					WsServerEndpoint.alertCareGiversForPatient(pat, "The patient "+pat.getName()+" has slept for more than 7 hours.");
				}
				break;
			case "Leaving":
				System.out.println("Leaving "+ pa.getStart() + " | " + pa.getEnding());
				if (pa.getEnding() - pa.getStart() > 5*60*60) {
					WsServerEndpoint.alertCareGiversForPatient(pat, "The patient "+pat.getName()+" has left for more than 5 hours.");
				}
				break;
			case "Toileting":
				System.out.println("Toileting "+ pa.getStart() + " | " + pa.getEnding());
			case "Showering":
				System.out.println("Showering "+ pa.getStart() + " | " + pa.getEnding());
				if (pa.getEnding() - pa.getStart() > 30*60) {
					WsServerEndpoint.alertCareGiversForPatient(pat, "The patient "+pat.getName()+" stayed in the bathroom for more than 30 minutes.");
				}
				break;
		}
	}
	
    @Bean
    public RabbitTemplate rabbitTemplate(final ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(producerJackson2MessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public Jackson2JsonMessageConverter producerJackson2MessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
