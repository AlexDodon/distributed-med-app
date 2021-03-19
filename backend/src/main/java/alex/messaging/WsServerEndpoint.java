package alex.messaging;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.springframework.stereotype.Component;

import alex.model.Patient;

@ServerEndpoint("/socket/test")
@Component
public class WsServerEndpoint {
	static ArrayList<Session> sessions = new ArrayList<Session>();
    static Map<String,Session> caregiverSessions = new HashMap<String,Session>();
	
	@OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("Successful connection | " + sessions.size() + " open connections");
    }


    @OnClose
    public void onClose(Session session) {
    	sessions.remove(session);
    	caregiverSessions.remove(session);
        System.out.println("Connection closure | " + sessions.size() + " open connections");
    }


    @OnMessage
    public String onMsg(Session session, String text) throws IOException {
    	if (text.contains("careGiver")) {
    		caregiverSessions.put(text, session);
    	}
    	System.out.println("Received message: " + text);
    	return null;
    }

    public static void alertCareGiversForPatient(Patient pat, String alert) {  
    	System.out.println("Got a patient alert: " + alert);
    	pat.getCareGivers().forEach(x -> {
    		System.out.println("alerting caregiver: " + x.getName());
    		Session cs = caregiverSessions.get("careGiver " + x.getId());
    		if (cs != null) {
    			try {
					cs.getBasicRemote().sendText(alert);
				} catch (IOException e) {
					e.printStackTrace();
				}
    		}
    	});
    }
}
