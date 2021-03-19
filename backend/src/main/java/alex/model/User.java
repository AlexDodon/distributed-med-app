  package alex.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Inheritance(strategy=InheritanceType.TABLE_PER_CLASS)
public abstract class User {
	@Id
	@GeneratedValue(strategy = GenerationType.TABLE)
	@NonNull
	private Integer id;
	
	@Column(name = "username")
	@NonNull
	private String username;
	
	@Column(name = "password")
	@NonNull
	@JsonIgnore
	private String password;
	
	@Column(name = "name")
	@NonNull
	private String name;
	
	@Column(name = "address")
	@NonNull
	private String address;

	@Column(name = "birthDate")
	@NonNull
	private String birthDate;
	
	@Column(name = "gender")
	@NonNull
	private String gender;
	
	@Column(name = "roles")
	@NonNull
	@JsonIgnore
	private String roles;
	
	@Column(name = "permissions")
	@NonNull
	@JsonIgnore
	private String permissions;
}
