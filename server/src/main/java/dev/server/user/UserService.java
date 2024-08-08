package dev.server.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService {
        @Autowired
        private final UserRepository userRepository;
        
        public User postUser(User user) {
            userRepository.save(user);

            return user;
        }
}
