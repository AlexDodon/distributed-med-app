package alex.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import alex.model.User;

@RepositoryRestResource(exported=false)
public interface UserRepository extends JpaRepository<User, Integer> {
	
    User findByUsername(String username);
}
